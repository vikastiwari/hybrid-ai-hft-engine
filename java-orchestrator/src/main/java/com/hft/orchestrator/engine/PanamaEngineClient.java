package com.hft.orchestrator.engine;

import org.springframework.stereotype.Service;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;

import java.lang.foreign.*;
import java.lang.invoke.MethodHandle;
import java.lang.invoke.VarHandle;

@Service
public class PanamaEngineClient {
    private MethodHandle hftInit;
    private MethodHandle hftShutdown;
    private MethodHandle hftSubmitOrder;
    private MethodHandle hftGetLobPointer;

    private Arena sharedArena;
    private MemorySegment lobSegment;
    private VarHandle priceHandle;
    private VarHandle volumeHandle;
    
    @PostConstruct
    public void init() {
        String path1 = System.getProperty("user.dir") + "/../cpp-execution-core/build/libhft_execution.so";
        String path2 = System.getProperty("user.dir") + "/cpp-execution-core/build/libhft_execution.so";
        String path3 = "/home/vikas/Projects/hybrid-ai-hft-engine/cpp-execution-core/build/libhft_execution.so";
        
        String libPath = new java.io.File(path1).exists() ? path1 :
                         new java.io.File(path2).exists() ? path2 : path3;

        System.load(new java.io.File(libPath).getAbsolutePath());
        Linker linker = Linker.nativeLinker();
        SymbolLookup stdlib = SymbolLookup.loaderLookup();
        
        hftInit = linker.downcallHandle(stdlib.find("hft_init").get(), FunctionDescriptor.ofVoid());
        hftShutdown = linker.downcallHandle(stdlib.find("hft_shutdown").get(), FunctionDescriptor.ofVoid());
        hftSubmitOrder = linker.downcallHandle(stdlib.find("hft_submit_order").get(), 
            FunctionDescriptor.of(ValueLayout.JAVA_INT, ValueLayout.JAVA_DOUBLE, ValueLayout.JAVA_INT, ValueLayout.JAVA_INT));
        
        // Bind the function that returns a pointer to the array
        hftGetLobPointer = linker.downcallHandle(stdlib.find("hft_get_lob_pointer").get(), FunctionDescriptor.of(ValueLayout.ADDRESS));
        
        try {
            hftInit.invokeExact();
            
            // Extreme Optimization: Map the C++ memory array to Java using a Shared Arena
            sharedArena = Arena.ofShared();
            MemorySegment rawPointer = (MemorySegment) hftGetLobPointer.invokeExact();
            
            // Define the memory layout mirroring C++ struct LOBLevel { double price; int volume; }
            // Note: C++ structs often pad memory to align doubles. 
            // struct size is typically 16 bytes: 8 bytes for double, 4 for int, 4 for padding.
            StructLayout levelLayout = MemoryLayout.structLayout(
                ValueLayout.JAVA_DOUBLE.withName("price"),
                ValueLayout.JAVA_INT.withName("volume"),
                MemoryLayout.paddingLayout(4)
            );
            
            SequenceLayout lobLayout = MemoryLayout.sequenceLayout(1000, levelLayout);
            
            // Interpret the raw pointer as a bounded memory segment of exactly 16,000 bytes
            lobSegment = rawPointer.reinterpret(lobLayout.byteSize(), sharedArena, null);
            
            // Generate VarHandles for zero-copy JIT-optimized single instruction memory reads
            priceHandle = lobLayout.varHandle(MemoryLayout.PathElement.sequenceElement(), MemoryLayout.PathElement.groupElement("price"));
            volumeHandle = lobLayout.varHandle(MemoryLayout.PathElement.sequenceElement(), MemoryLayout.PathElement.groupElement("volume"));
            
            System.out.println("[Panama FFM] LOB Native Memory Segment Mapped successfully. Zero-copy access enabled.");
            
        } catch (Throwable e) {
            throw new RuntimeException("Failed to initialize C++ execution engine via Panama", e);
        }
    }
    
    // Example method to demonstrate zero-copy read
    public double getPriceAtLevel(int level) {
        return (double) priceHandle.get(lobSegment, (long)level);
    }
    
    public int submitOrder(double price, int quantity, int side) {
        try {
            return (int) hftSubmitOrder.invokeExact(price, quantity, side);
        } catch (Throwable e) {
            return -1;
        }
    }

    @PreDestroy
    public void destroy() {
        try {
            hftShutdown.invokeExact();
            if (sharedArena != null && sharedArena.scope().isAlive()) {
                sharedArena.close();
            }
        } catch (Throwable e) {
            e.printStackTrace();
        }
    }
}
