#!/bin/bash
set -e

echo "==========================================================="
echo "🔄 Hybrid AI Trading Engine - Deterministic Replay Engine 🔄"
echo "==========================================================="

echo "[1/2] Loading Sample BTCUSDT L2 Tick Data..."
# In a real environment, this would parse gigabytes of PCAP/CSV data.
sleep 1

echo "[2/2] Executing ONNX D3QN Model against Replay Data..."
cd python-drl-brain
source venv/bin/activate
python3 replay.py
cd ..

echo "==========================================================="
echo "✅ Replay Completed Successfully."
echo "==========================================================="
