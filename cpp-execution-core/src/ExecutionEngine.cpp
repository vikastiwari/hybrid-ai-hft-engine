#include "ExecutionEngine.h"
#include "network/PosixSocketClient.h"
#include "network/TCPDirectClient.h"
#include <iostream>

ExecutionEngine::ExecutionEngine() {
    std::cout << "[ExecutionEngine] Initializing Execution Core...\n";
    
#ifdef USE_TCPDIRECT
    network = std::make_unique<TCPDirectClient>();
#else
    network = std::make_unique<PosixSocketClient>();
#endif
    
    // Connect to mock exchange IP
    network->init("127.0.0.1", 9000);
}

ExecutionEngine::~ExecutionEngine() {}

void ExecutionEngine::connect(const std::string& api_key, const std::string& secret) {
    std::cout << "[ExecutionEngine] Connected to Exchange. API Key masked." << std::endl;
}

void ExecutionEngine::execute_market_order(const std::string& symbol, int quantity, bool is_buy) {
    std::string payload = "MKT " + std::string(is_buy ? "BUY " : "SELL ") + std::to_string(quantity) + " " + symbol;
    network->send_order(payload.c_str(), payload.length());
    std::cout << "[ExecutionEngine] Routed via NetworkClient -> " << payload << std::endl;
}

void ExecutionEngine::execute_limit_order(const std::string& symbol, int quantity, double price, bool is_buy) {
    std::string payload = "LMT " + std::string(is_buy ? "BUY " : "SELL ") + std::to_string(quantity) + " " + symbol + " @" + std::to_string(price);
    network->send_order(payload.c_str(), payload.length());
    std::cout << "[ExecutionEngine] Routed via NetworkClient -> " << payload << std::endl;
}
