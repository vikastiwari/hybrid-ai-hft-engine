#include "OrderBook.h"
#include <cstdlib>

OrderBook::OrderBook() {}
OrderBook::~OrderBook() {}

void OrderBook::add_order(bool is_bid, double price, int quantity) {
    if (is_bid) m_bids[price] += quantity;
    else m_asks[price] += quantity;
}

void OrderBook::update_order(bool is_bid, double price, int new_quantity) {
    if (new_quantity == 0) {
        remove_order(is_bid, price);
    } else {
        if (is_bid) m_bids[price] = new_quantity;
        else m_asks[price] = new_quantity;
    }
}

void OrderBook::remove_order(bool is_bid, double price) {
    if (is_bid) m_bids.erase(price);
    else m_asks.erase(price);
}

std::vector<float> OrderBook::get_l2_state(int depth) {
    std::vector<float> state;
    
    // Mock a random walk price starting around 150.0
    static float current_price = 150.0f;
    current_price += ((rand() % 100) - 50) / 100.0f; 
    
    state.push_back(current_price);
    
    for (int i = 1; i < depth * 2; ++i) {
        state.push_back(0.0f);
    }
    
    return state;
}
