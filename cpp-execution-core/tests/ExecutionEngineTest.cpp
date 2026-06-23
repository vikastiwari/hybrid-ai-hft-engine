#include <gtest/gtest.h>
#include "../src/ExecutionEngine.h"
#include "../src/panama_bindings.h"
#include <iostream>
#include <sstream>

// Test Fixture
class ExecutionEngineTest : public ::testing::Test {
protected:
    void SetUp() override {
        // Suppress standard output during tests to keep logs clean
        original_buf = std::cout.rdbuf(buffer.rdbuf());
    }

    void TearDown() override {
        std::cout.rdbuf(original_buf);
    }

    std::stringstream buffer;
    std::streambuf* original_buf;
};

TEST_F(ExecutionEngineTest, InitializationSucceeds) {
    ExecutionEngine engine;
    EXPECT_TRUE(true); // Should not crash
}

TEST_F(ExecutionEngineTest, LOBPointerIsExposed) {
    hft_init();
    struct LOBLevel* lob = hft_get_lob_pointer();
    ASSERT_NE(lob, nullptr);
    
    // Check mock data integrity
    EXPECT_DOUBLE_EQ(lob[0].price, 100.0);
    EXPECT_EQ(lob[0].volume, 10);
    
    EXPECT_DOUBLE_EQ(lob[999].price, 109.99);
    EXPECT_EQ(lob[999].volume, 1009);
}

TEST_F(ExecutionEngineTest, OrderRoutingPayloadGeneration) {
    ExecutionEngine engine;
    
    // We mock the network send_order by verifying it doesn't segfault 
    // and outputs the expected payload text to stdout.
    engine.execute_market_order("BTC/USD", 50, true);
    std::string output = buffer.str();
    EXPECT_TRUE(output.find("MKT BUY 50 BTC/USD") != std::string::npos);
    
    buffer.str(""); // Clear buffer
    
    engine.execute_limit_order("ETH/USD", 100, 3100.50, false);
    output = buffer.str();
    EXPECT_TRUE(output.find("LMT SELL 100 ETH/USD @3100.50") != std::string::npos);
}
