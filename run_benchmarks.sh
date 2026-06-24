#!/bin/bash

# Master Benchmark Script
# This script executes the nanosecond-level performance benchmarks.

# Log all output to a file and stdout simultaneously
exec > >(tee -i benchmark_results.log) 2>&1

echo "================================================="
echo "⚡ Starting Hybrid AI HFT Engine Benchmarks ⚡"
echo "================================================="

echo ""
echo "[1/3] Compiling C++ Execution Core..."
cd cpp-execution-core
mkdir -p build && cd build
cmake .. > /dev/null
make > /dev/null
if [ $? -ne 0 ]; then
    echo "❌ C++ Compilation Failed!"
    exit 1
fi
echo "✅ C++ Core Compiled."
cd ../..

echo ""
echo "[2/3] Running Python ONNX Inference Benchmark..."
cd python-drl-brain

echo "Ensuring Python virtual environment and dependencies..."
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt onnxruntime gymnasium stable-baselines3 onnxscript > /dev/null

# Ensure model exists, if not, train a dummy one quickly
if [ ! -f "models/d3qn_hft_alpha.onnx" ]; then
    echo "Model not found. Running quick training to generate model..."
    python3 train.py > /dev/null
fi
python3 benchmark.py
deactivate
cd ..

echo ""
echo "[3/3] Running Java JMH FFM Zero-Copy Benchmark..."
echo "This takes about ~20 seconds to warm up the JIT compiler..."
cd java-orchestrator

export MAVEN_OPTS="--enable-preview --enable-native-access=ALL-UNNAMED"
mvn clean compile test-compile -q -B > /dev/null
mvn exec:java -q -B -Dexec.mainClass="com.hft.orchestrator.benchmark.FFMBridgeBenchmark" -Dexec.classpathScope=test
cd ..

echo ""
echo "================================================="
echo "🏆 Benchmarks Completed Successfully 🏆"
echo "================================================="
