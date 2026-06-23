#!/bin/bash

# Master Test Orchestration Script
# This script runs all validation suites across the Hybrid AI HFT Engine

echo "============================================="
echo "🧪 Running Hybrid AI HFT Engine Test Suites 🧪"
echo "============================================="

# 1. C++ Execution Core Tests
echo ""
echo "[1/3] Running C++ Native Core Tests (CMake/CTest)..."
cd cpp-execution-core
mkdir -p build && cd build
cmake .. > /dev/null
make > /dev/null
ctest --output-on-failure
if [ $? -ne 0 ]; then
    echo "❌ C++ Tests Failed!"
    exit 1
fi
echo "✅ C++ Tests Passed!"
cd ../..

# 2. Java Orchestrator Tests
echo ""
echo "[2/3] Running Java Orchestrator Tests (JUnit 5)..."
cd java-orchestrator
mvn test
if [ $? -ne 0 ]; then
    echo "❌ Java Tests Failed!"
    exit 1
fi
echo "✅ Java Tests Passed!"
cd ..

# 3. React Dashboard Tests
echo ""
echo "[3/3] Running React Telemetry Dashboard Tests (Vitest)..."
cd react-dashboard
npm run test -- --run
if [ $? -ne 0 ]; then
    echo "❌ React Tests Failed!"
    exit 1
fi
echo "✅ React Tests Passed!"
cd ..

echo ""
echo "============================================="
echo "🏆 ALL TEST SUITES PASSED SUCCESSFULLY 🏆"
echo "============================================="
