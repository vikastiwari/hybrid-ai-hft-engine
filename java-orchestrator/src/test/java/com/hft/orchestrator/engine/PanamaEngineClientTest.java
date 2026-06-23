package com.hft.orchestrator.engine;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import com.hft.orchestrator.ai.DJLModelManager;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class PanamaEngineClientTest {

    @Autowired
    private PanamaEngineClient engineClient;

    @MockBean
    private DJLModelManager djlModelManager;

    @Test
    void testPanamaBindingsInitialization() {
        assertNotNull(engineClient, "PanamaEngineClient should be initialized and injected by Spring.");
    }

    @Test
    void testZeroCopyMemoryRead() {
        // Test that we can read the initial mocked value from C++ 
        // The mock C++ code initializes level 0 to 100.0
        double price = engineClient.getPriceAtLevel(0);
        assertEquals(100.0, price, 0.001, "VarHandle failed to read the correct price from native memory.");
    }

    @Test
    void testOrderSubmission() {
        // Ensure the JNI downcall for submit_order doesn't crash
        int result = engineClient.submitOrder(150.25, 10, 1);
        assertTrue(result >= 0, "Submit order should return a valid status code.");
    }
}
