#pragma once
#include "NetworkClient.h"
#include <string>

// Proprietary Solarflare/TCPDirect implementation
class TCPDirectClient : public NetworkClient {
private:
#ifdef USE_TCPDIRECT
    // In a real environment, we would include <zf/zf.h>
    struct zf_stack* stack;
    struct zf_attr* attr;
#endif

public:
    TCPDirectClient();
    ~TCPDirectClient() override;

    void init(const std::string& host, int port) override;
    void poll() override;
    void send_order(const void* data, size_t size) override;
};
