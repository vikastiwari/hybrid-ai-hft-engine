import time
import numpy as np
import onnxruntime as ort

def run_benchmark():
    model_path = "models/d3qn_hft_alpha.onnx"
    print("=============================================")
    print("🧠 Starting D3QN ONNX Inference Benchmark")
    print(f"Loading model: {model_path}")
    
    try:
        session = ort.InferenceSession(model_path)
    except Exception as e:
        print(f"Error loading model: {e}. Make sure you run train.py first.")
        return

    input_name = session.get_inputs()[0].name
    input_shape = session.get_inputs()[0].shape
    
    # Handle dynamic batch size if present
    if isinstance(input_shape[0], str) or input_shape[0] is None:
        input_shape[0] = 1
        
    print(f"Input Shape: {input_shape}")
    
    # Warmup
    print("Warming up JIT/ONNX Engine...")
    for _ in range(1000):
        dummy_input = np.random.randn(*input_shape).astype(np.float32)
        session.run(None, {input_name: dummy_input})

    # Benchmark
    iterations = 10000
    print(f"Running {iterations} iterations...")
    
    start_time = time.perf_counter()
    for _ in range(iterations):
        dummy_input = np.random.randn(*input_shape).astype(np.float32)
        session.run(None, {input_name: dummy_input})
    end_time = time.perf_counter()

    total_time_s = end_time - start_time
    avg_latency_us = (total_time_s / iterations) * 1_000_000

    print("---------------------------------------------")
    print(f"Total Time: {total_time_s:.4f} seconds")
    print(f"Average Inference Latency: {avg_latency_us:.2f} µs")
    print("=============================================")

if __name__ == "__main__":
    run_benchmark()
