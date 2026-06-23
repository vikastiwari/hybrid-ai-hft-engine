# Quickstart: Local WSL Testing Guide

This document explains exactly how to compile, test, and run the `hybrid-ai-hft-engine` entirely within your local Windows Subsystem for Linux (WSL) environment, using safe POSIX sockets and native libraries.

## Prerequisites
Before running, ensure your WSL Ubuntu environment has the necessary build tools and runtimes:
- **Java**: JDK 22+ (required for Project Panama FFM API)
- **Maven**: To build the Spring Boot orchestrator
- **C++ Build Tools**: `cmake`, `make`, `g++` (supporting C++17/20)
- **Node.js & npm**: (Version 22.16.0+) for the React Dashboard
- **Python 3.12+**: For offline model training

## Step 1: Run the C++ Unit Tests (GoogleTest)
The engine has a robust test suite for the C++ Execution Core. 
To build and run the tests:
```bash
cd cpp-execution-core
cmake -B build
cmake --build build
./build/hft_tests
```
You should see all GoogleTest assertions pass successfully.

## Step 2: Run the Java Integration Tests
The Java Orchestrator utilizes JUnit 5 to mathematically verify the zero-copy `VarHandle` memory bindings.
```bash
cd java-orchestrator
mvn clean test
```
*Note: Because our tests map native C++ pointers, Maven automatically injects the `--enable-preview` JVM flag during the test phase to enable Project Panama.*

## Step 3: Run the Full End-to-End System
We have completely automated the orchestration. The master script will compile the C++ `.so` shared library and boot up the Spring Boot Java process.

1. **Launch the Engine:**
   Return to the root project directory and execute:
   ```bash
   ./run_system.sh
   ```
   You will see the C++ Execution Core initialize in POSIX Socket mode, followed by the Spring Boot server booting up with the elite Generational ZGC flags.

2. **Launch the Dashboard:**
   Open a separate WSL terminal and run the setup script to install a native Node.js environment (which bypasses Windows UNC filesystem errors):
   ```bash
   ./setup_dashboard_wsl.sh
   source ~/.bashrc
   cd react-dashboard
   npm run dev
   ```
3. **View the Dashboard:**
   Open your browser in Windows and navigate to `http://localhost:5173`. You will see the Live Level-2 Order Book and the real-time UDP telemetry streaming!

## Architecture Fallback Note
Because you are running on WSL, the `ExecutionEngine` gracefully falls back to the `PosixSocketClient`. The proprietary `TCPDirect` kernel bypass is safely guarded behind the `#ifdef USE_TCPDIRECT` compiler macro and will only activate when you deploy to a bare-metal Xilinx Solarflare server.
