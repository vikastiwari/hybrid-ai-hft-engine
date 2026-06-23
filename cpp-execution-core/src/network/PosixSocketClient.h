#pragma once
#include "NetworkClient.h"
#include <string>
#include <sys/socket.h>
#include <netinet/in.h>

class PosixSocketClient : public NetworkClient {
private:
    int sockfd;
    struct sockaddr_in server_addr;

public:
    PosixSocketClient();
    ~PosixSocketClient() override;

    void init(const std::string& host, int port) override;
    void poll() override;
    void send_order(const void* data, size_t size) override;
};
