#pragma once
#include <cstddef>
#include <string>

class NetworkClient {
public:
    virtual ~NetworkClient() = default;

    // Initialize the network stack and establish connections
    virtual void init(const std::string& host, int port) = 0;

    // Poll the network interface for incoming data (non-blocking)
    virtual void poll() = 0;

    // Transmit data to the exchange
    virtual void send_order(const void* data, size_t size) = 0;
};
