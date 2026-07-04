import asyncio
import websockets
import random

logs = [
    "[C++] Execution Engine: Memory-mapped LOB synced at 150.25",
    "ONNX Inference: D3QN evaluated state [Action: BUY_0.1, Q-Val: 1.25]",
    "[C++] Execution: BUY 100 @ 150.25 (Latency: 1.8us)",
    "[Panama] Zero-Copy: Memory Segment Arena.ofShared() read 16KB LOB state",
    "TCPDirect: Flushed 64 bytes to kernel ring buffer",
    "LOB Updater: Processed 500 ticks from UDP stream",
    "ONNX Inference: D3QN evaluated state [Action: HOLD, Q-Val: 1.21]",
    "[C++] Execution: SELL 100 @ 150.35 (Latency: 1.9us)",
    "Risk Check: Margin within limits. Max inventory: 5000",
    "ZGC: Concurrent mark cycle completed in 0.01ms",
    "[Java Orchestrator] Spring WebFlux streaming event to SSE/WS clients",
    "DJL: Executed forward pass on d3qn_hft_alpha.onnx in 8.7us",
]

async def handler(websocket):
    print("React UI Connected to WebSocket.")
    while True:
        try:
            log = random.choice(logs)
            await websocket.send(log)
            await asyncio.sleep(0.1)
        except websockets.exceptions.ConnectionClosed:
            print("React UI disconnected.")
            break

async def main():
    print("Mock WebSocket Server running on ws://localhost:8080/ws...")
    async with websockets.serve(handler, "localhost", 8080):
        await asyncio.Future()  # run forever

if __name__ == "__main__":
    asyncio.run(main())
