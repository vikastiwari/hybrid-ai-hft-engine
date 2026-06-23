package com.hft.orchestrator.ai;

import ai.djl.inference.Predictor;
import ai.djl.ndarray.NDArray;
import ai.djl.ndarray.NDList;
import ai.djl.ndarray.NDManager;
import ai.djl.repository.zoo.Criteria;
import ai.djl.repository.zoo.ZooModel;
import org.springframework.stereotype.Service;
import jakarta.annotation.PostConstruct;

import java.nio.file.Paths;

@Service
public class DJLModelManager {
    
    private ZooModel<NDList, NDList> model;
    private Predictor<NDList, NDList> predictor;

    @PostConstruct
    public void init() {
        try {
            Criteria<NDList, NDList> criteria = Criteria.builder()
                    .setTypes(NDList.class, NDList.class)
                    .optModelPath(Paths.get("/home/vikas/Projects/hybrid-ai-hft-engine/python-drl-brain/models/d3qn_hft_alpha.onnx"))
                    .optEngine("OnnxRuntime")
                    .build();
                    
            model = criteria.loadModel();
            predictor = model.newPredictor();
            System.out.println("[Java DJL] ONNX Model loaded successfully in-process.");
        } catch (Exception e) {
            System.err.println("[Java DJL] Warning: Failed to load ONNX model. Using dummy predictions. Reason: " + e.getMessage());
        }
    }
    
    public float predictAction(float[] observation) {
        if (predictor == null) return 0.0f; // Dummy prediction
        try (NDManager manager = NDManager.newBaseManager()) {
            NDArray array = manager.create(observation);
            NDList input = new NDList(array);
            NDList output = predictor.predict(input);
            return output.singletonOrThrow().getFloat();
        } catch (Exception e) {
            e.printStackTrace();
            return 0.0f;
        }
    }
}
