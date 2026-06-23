#include "PosixSocketClient.h"
#include <iostream>
#include <unistd.h>
#include <arpa/inet.h>
#include <fcntl.h>

PosixSocketClient::PosixSocketClient() : sockfd(-1) {}

PosixSocketClient::~PosixSocketClient() {
    if (sockfd != -1) {
        close(sockfd);
    }
}

void PosixSocketClient::init(const std::string& host, int port) {
    sockfd = socket(AF_INET, SOCK_STREAM, 0);
    if (sockfd < 0) {
        std::cerr << "[Network] Failed to create POSIX socket\n";
        return;
    }
    
    server_addr.sin_family = AF_INET;
    server_addr.sin_port = htons(port);
    inet_pton(AF_INET, host.c_str(), &server_addr.sin_addr);
    
    // In a real environment, we would connect() and set O_NONBLOCK
    std::cout << "[Network] Initialized Standard POSIX Socket Client (Local/Cloud Mode)\n";
}

void PosixSocketClient::poll() {
    // Non-blocking read via standard recv()
    char buffer[1024];
    ssize_t bytes = recv(sockfd, buffer, sizeof(buffer), MSG_DONTWAIT);
    if (bytes > 0) {
        // Process standard packet
    }
}

void PosixSocketClient::send_order(const void* data, size_t size) {
    if (sockfd >= 0) {
        // Use MSG_NOSIGNAL to prevent SIGPIPE crash if disconnected
        send(sockfd, data, size, MSG_DONTWAIT | MSG_NOSIGNAL);
    }
}
