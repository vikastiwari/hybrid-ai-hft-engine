#pragma once

#include <atomic>
#include <cstdint>

// Cache-line aligned struct to prevent false sharing between C++ and Python threads
struct alignas(64) IPC_RingBuffer {
    std::atomic<uint32_t> write_index;
    char padding1[60]; // Pad to 64 bytes (assuming 4-byte atomic)

    std::atomic<uint32_t> read_index;
    char padding2[60];

    // Arbitrary size for the state matrix (e.g., LOB depth + sentiment)
    static constexpr size_t MAX_SLOTS = 1024;
    static constexpr size_t OBS_DIM = 64; 
    
    float observation_space[MAX_SLOTS][OBS_DIM];
};

struct alignas(64) IPC_ActionBuffer {
    std::atomic<uint32_t> write_index;
    char padding1[60];

    std::atomic<uint32_t> read_index;
    char padding2[60];

    static constexpr size_t MAX_SLOTS = 1024;
    static constexpr size_t ACT_DIM = 4; // e.g. [signal, price, qty, timeout]

    float action_space[MAX_SLOTS][ACT_DIM];
};

struct IPC_SharedRegion {
    IPC_RingBuffer state_ring;
    IPC_ActionBuffer action_ring;
};
