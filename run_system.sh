#!/bin/bash
set -e

echo "==========================================================="
echo "⚡ Hybrid AI High-Frequency Trading System Initialization ⚡"
echo "==========================================================="

# 1. Compile C++ Execution Core (Shared Library)
echo "[1/2] Compiling C++ Low-Latency Core as Shared Library..."
mkdir -p cpp-execution-core/build
cd cpp-execution-core/build
cmake .. -DCMAKE_BUILD_TYPE=Release
make -j4
cd ../..

# 2. Start Java Orchestrator (Spring Boot + DJL + Panama)
echo "[2/2] Launching Java Orchestrator (In-Process Inference & Execution)..."
cd java-orchestrator
# Assumes Maven is installed and Java 22+ is available
# Run with preview features enabled for Project Panama FFM API and elite ZGC tuning
export MAVEN_OPTS="-Xms4g -Xmx4g -XX:ConcGCThreads=2"
mvn spring-boot:run -Dspring-boot.run.jvmArguments="--enable-preview --enable-native-access=ALL-UNNAMED -XX:+UseZGC -XX:+ZGenerational -XX:-ZUncommit -XX:+AlwaysPreTouch" &
JAVA_PID=$!
cd ..

echo "==========================================================="
echo "✅ All core systems running! System is live."
echo "👉 Launch your React Dashboard now: cd react-dashboard && npm run dev"
echo "Press [CTRL+C] to gracefully terminate all processes."
echo "==========================================================="

# Trap SIGINT to kill background jobs
trap "echo 'Shutting down system...'; kill $JAVA_PID; exit" SIGINT SIGTERM

# Wait indefinitely
wait
