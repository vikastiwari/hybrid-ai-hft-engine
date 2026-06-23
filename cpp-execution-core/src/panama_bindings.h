#pragma once

#ifdef __cplusplus
extern "C" {
#endif

// Engine control
void hft_init();
void hft_shutdown();

// Order routing
int hft_submit_order(double price, int quantity, int side);

// Market data access (Zero-copy access for Panama)
struct LOBLevel {
    double price;
    int volume;
};

struct LOBLevel* hft_get_lob_pointer();

double hft_get_best_bid();
double hft_get_best_ask();
int hft_get_inventory();

#ifdef __cplusplus
}
#endif
