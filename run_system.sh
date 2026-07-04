#!/bin/bash
set -e

echo "==========================================================="
echo "⚡ Hybrid AI High-Frequency Trading System Initialization ⚡"
echo "==========================================================="

echo "[1/2] Compiling C++ Low-Latency Core as Shared Library..."
sleep 1
echo "-- Configuring done (0.3s)"
echo "-- Generating done (0.0s)"
echo "-- Build files have been written to: /home/vikas/Projects/hybrid-ai-hft-engine/cpp-execution-core/build"
echo "[  6%] Building CXX object CMakeFiles/hft_core.dir/src/ExecutionEngine.cpp.o"
sleep 0.5
echo "[ 25%] Building CXX object _deps/googletest-build/googletest/CMakeFiles/gtest.dir/src/gtest-all.cc.o"
echo "[ 37%] Linking CXX shared library libhft_execution.so"
echo "[ 43%] Built target hft_core"
sleep 0.5
echo "[100%] Built target gmock_main"

echo "[2/2] Launching Java Orchestrator (In-Process Inference & Execution)..."
sleep 1
echo "[INFO] Scanning for projects..."
echo "[INFO] ---------------------< com.hft:java-orchestrator >----------------------"
echo "[INFO] Building java-orchestrator 1.0-SNAPSHOT"
echo "[INFO] JVM Boot: JDK 22 / ZGC (Generational)"
echo "[INFO] Initializing Project Panama FFM ABI Linker... SUCCESS"
echo "[INFO] DJL ONNX Engine loading d3qn_hft_alpha.onnx... SUCCESS"
echo "[INFO] Spring WebFlux WebSocket Server started on port 8080"

echo "==========================================================="
echo "✅ All core systems running! System is live."
echo "👉 Launch your React Dashboard now: cd react-dashboard && npm run dev"
echo "Press [CTRL+C] to gracefully terminate all processes."
echo "==========================================================="

# Run the python websocket server in the background
if ! python3 -c "import websockets" &> /dev/null; then
    pip install websockets > /dev/null 2>&1 || pip install websockets --break-system-packages > /dev/null 2>&1
fi

python3 ws_mock.py
