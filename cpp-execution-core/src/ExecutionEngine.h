#pragma once
#include <string>
#include <memory>
#include "network/NetworkClient.h"

class ExecutionEngine {
private:
    std::unique_ptr<NetworkClient> network;
public:
    ExecutionEngine();
    ~ExecutionEngine();

    void connect(const std::string& api_key, const std::string& secret);
    void execute_market_order(const std::string& symbol, int quantity, bool is_buy);
    void execute_limit_order(const std::string& symbol, int quantity, double price, bool is_buy);
};
