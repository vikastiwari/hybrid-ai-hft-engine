#pragma once
#include <map>
#include <vector>

struct Order {
    double price;
    int quantity;
};

class OrderBook {
public:
    OrderBook();
    ~OrderBook();

    void add_order(bool is_bid, double price, int quantity);
    void update_order(bool is_bid, double price, int new_quantity);
    void remove_order(bool is_bid, double price);

    std::vector<float> get_l2_state(int depth = 10);

private:
    std::map<double, int, std::greater<double>> m_bids; // Descending
    std::map<double, int, std::less<double>> m_asks;    // Ascending
};
