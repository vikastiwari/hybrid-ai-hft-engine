import os
import gymnasium as gym
from stable_baselines3 import PPO
from stable_baselines3.common.env_checker import check_env
from envs.hft_env import HFTEnv

def main():
    print("Initializing HFT Training Environment...")
    env = HFTEnv()
    
    print("Checking environment compliance...")
    check_env(env)
    
    print("Building PPO Model...")
    # High entropy coefficient to encourage exploring the complex L2 book
    model = PPO("MlpPolicy", env, verbose=1, ent_coef=0.01)
    
    print("Training Model Offline (10,000 steps)...")
    model.learn(total_timesteps=10000)
    
    os.makedirs("models", exist_ok=True)
    model_path = "models/d3qn_hft_alpha"
    model.save(model_path)
    print(f"Model successfully saved to {model_path}.zip")

    print("Exporting Policy Network to ONNX for Java DJL Inference...")
    import torch
    
    class OnnxablePolicy(torch.nn.Module):
        def __init__(self, extractor, action_net, value_net):
            super().__init__()
            self.extractor = extractor
            self.action_net = action_net
            self.value_net = value_net

        def forward(self, observation):
            # NOTE: You may need to adjust this depending on the exact policy structure
            # This is a basic export wrapper for the actor network
            action_hidden, _ = self.extractor(observation)
            return self.action_net(action_hidden)

    onnx_policy = OnnxablePolicy(
        model.policy.mlp_extractor, 
        model.policy.action_net, 
        model.policy.value_net
    )
    
    # Create dummy observation matching the env observation space
    dummy_input = torch.randn(1, *env.observation_space.shape)
    
    onnx_path = "models/d3qn_hft_alpha.onnx"
    torch.onnx.export(
        onnx_policy,
        dummy_input,
        onnx_path,
        opset_version=17,
        input_names=['observation'],
        output_names=['action']
    )
    print(f"ONNX Model successfully exported to {onnx_path}")

if __name__ == "__main__":
    main()
