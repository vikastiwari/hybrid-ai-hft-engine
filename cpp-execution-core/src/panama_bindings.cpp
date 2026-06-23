#include "panama_bindings.h"
#include "ExecutionEngine.h"
#include <memory>
#include <iostream>

// Mocking a fixed 1000-level LOB array for Panama to map
static struct LOBLevel g_lob[1000];

static std::unique_ptr<ExecutionEngine> g_engine = nullptr;

void hft_init() {
    if (!g_engine) {
        g_engine = std::make_unique<ExecutionEngine>();
        // Initialize mock data
        for (int i=0; i<1000; i++) {
            g_lob[i].price = 100.0 + (i * 0.01);
            g_lob[i].volume = 10 + i;
        }
        std::cout << "[C++] Execution Engine Initialized for Panama" << std::endl;
    }
}

void hft_shutdown() {
    g_engine.reset();
    std::cout << "[C++] Execution Engine Shutdown" << std::endl;
}

int hft_submit_order(double price, int quantity, int side) {
    if (!g_engine) return -1;
    // Mocking an order submission that the original engine would do
    // return g_engine->submitOrder(price, quantity, side);
    return 0; // Success
}

struct LOBLevel* hft_get_lob_pointer() {
    return g_lob;
}

double hft_get_best_bid() {
    if (!g_engine) return 0.0;
    // return g_engine->getOrderBook()->getBestBid();
    return 100.0;
}

double hft_get_best_ask() {
    if (!g_engine) return 0.0;
    // return g_engine->getOrderBook()->getBestAsk();
    return 100.5;
}

int hft_get_inventory() {
    if (!g_engine) return 0;
    return 10;
}
