package com.hft.orchestrator.benchmark;

import org.openjdk.jmh.annotations.*;
import org.openjdk.jmh.runner.Runner;
import org.openjdk.jmh.runner.RunnerException;
import org.openjdk.jmh.runner.options.Options;
import org.openjdk.jmh.runner.options.OptionsBuilder;
import org.openjdk.jmh.results.format.ResultFormatType;

import java.lang.foreign.*;
import java.lang.invoke.MethodHandle;
import java.lang.invoke.VarHandle;
import java.util.concurrent.TimeUnit;

@BenchmarkMode(Mode.AverageTime)
@OutputTimeUnit(TimeUnit.NANOSECONDS)
@State(Scope.Thread)
@Fork(0)
@Warmup(iterations = 3, time = 1)
@Measurement(iterations = 5, time = 1)
public class FFMBridgeBenchmark {

    private static final String LIB_PATH = "/home/vikas/Projects/hybrid-ai-hft-engine/cpp-execution-core/build/libhft_execution.so";
    
    private MethodHandle hftGetLobPointer;
    private Arena sharedArena;
    private MemorySegment lobSegment;
    private VarHandle priceHandle;

    @Setup
    public void setup() {
        try {
            System.load(LIB_PATH);
            Linker linker = Linker.nativeLinker();
            SymbolLookup stdlib = SymbolLookup.loaderLookup();
            
            MethodHandle hftInit = linker.downcallHandle(stdlib.find("hft_init").get(), FunctionDescriptor.ofVoid());
            hftGetLobPointer = linker.downcallHandle(stdlib.find("hft_get_lob_pointer").get(), FunctionDescriptor.of(ValueLayout.ADDRESS));
            
            hftInit.invokeExact();
            
            sharedArena = Arena.ofShared();
            MemorySegment rawPointer = (MemorySegment) hftGetLobPointer.invokeExact();
            
            StructLayout levelLayout = MemoryLayout.structLayout(
                ValueLayout.JAVA_DOUBLE.withName("price"),
                ValueLayout.JAVA_INT.withName("volume"),
                MemoryLayout.paddingLayout(4)
            );
            
            SequenceLayout lobLayout = MemoryLayout.sequenceLayout(1000, levelLayout);
            lobSegment = rawPointer.reinterpret(lobLayout.byteSize(), sharedArena, null);
            priceHandle = lobLayout.varHandle(MemoryLayout.PathElement.sequenceElement(), MemoryLayout.PathElement.groupElement("price"));
        } catch (Throwable t) {
            throw new RuntimeException("Failed to initialize FFM Benchmark", t);
        }
    }

    @TearDown
    public void teardown() {
        if (sharedArena != null && sharedArena.scope().isAlive()) {
            sharedArena.close();
        }
    }

    @Benchmark
    public double benchmarkZeroCopyDereference() {
        // Simulating highly optimized zero-copy LOB read loop
        return (double) priceHandle.get(lobSegment, 0L);
    }

    public static void main(String[] args) throws RunnerException {
        Options opt = new OptionsBuilder()
                .include(FFMBridgeBenchmark.class.getSimpleName())
                .jvmArgs("--enable-preview", "--enable-native-access=ALL-UNNAMED")
                .resultFormat(ResultFormatType.CSV)
                .result("../benchmark_data.csv")
                .build();
        new Runner(opt).run();
    }
}
