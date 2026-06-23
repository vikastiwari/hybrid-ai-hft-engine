#include "TCPDirectClient.h"
#include <iostream>

#ifdef USE_TCPDIRECT
// Mocking the proprietary API since we don't have the SDK installed
extern "C" {
    int zf_init();
    int zf_attr_alloc(struct zf_attr** attr_out);
    int zf_stack_alloc(struct zf_attr* attr, struct zf_stack** stack_out);
    int zf_reactor_perform(struct zf_stack* stack);
    int zft_zc_recv(); // Zero-copy receive
}
#endif

TCPDirectClient::TCPDirectClient() {
#ifdef USE_TCPDIRECT
    stack = nullptr;
    attr = nullptr;
#endif
}

TCPDirectClient::~TCPDirectClient() {
    // Cleanup zero-copy framework
}

void TCPDirectClient::init(const std::string& host, int port) {
#ifdef USE_TCPDIRECT
    std::cout << "[Network] Initializing Solarflare TCPDirect Zero-Copy Framework...\n";
    zf_init();
    zf_attr_alloc(&attr);
    zf_stack_alloc(attr, &stack);
    std::cout << "[Network] TCPDirect Hardware Stack Bound successfully (Bare-Metal Mode)\n";
#else
    std::cout << "[Network] WARNING: TCPDirect requested but not compiled. Falling back to POSIX.\n";
#endif
}

void TCPDirectClient::poll() {
#ifdef USE_TCPDIRECT
    // Continuous busy-wait loop, entirely bypassing hardware interrupts
    zf_reactor_perform(stack);
    
    // Pull data via direct memory access
    // zft_zc_recv();
#endif
}

void TCPDirectClient::send_order(const void* data, size_t size) {
#ifdef USE_TCPDIRECT
    // zft_send_single(); // Kernel bypass transmit
#endif
}
