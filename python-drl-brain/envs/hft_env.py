import gymnasium as gym
from gymnasium import spaces
import numpy as np

class HFTEnv(gym.Env):
    """Custom Environment that follows gym interface for MAPPO offline training"""
    metadata = {'render.modes': ['human']}

    def __init__(self):
        super(HFTEnv, self).__init__()
        
        # Action space: Discrete(3) -> 0: HOLD, 1: BUY, 2: SELL
        self.action_space = spaces.Discrete(3)
        
        # Observation space: 64 dimensional L1/L2 book
        self.observation_space = spaces.Box(low=-np.inf, high=np.inf, shape=(64,), dtype=np.float32)
        
        self.current_step = 0
        self.max_steps = 1000
        
        self.inventory = 0
        self.balance = 10000.0

    def step(self, action):
        self.current_step += 1
        
        # Mock price from current state (observation[0] could represent price)
        current_price = 150.0 + np.random.randn()
        
        reward = 0.0
        if action == 1: # BUY
            self.inventory += 1
            self.balance -= current_price
        elif action == 2: # SELL
            self.inventory -= 1
            self.balance += current_price
            
        # Inventory holding penalty to discourage simply hoarding
        inventory_penalty = abs(self.inventory) * 0.1
        
        # Mark to market value
        mtm_value = self.balance + (self.inventory * current_price)
        
        # Reward is change in PnL minus penalty
        reward = mtm_value - 10000.0 - inventory_penalty
        
        # Next state
        next_state = np.random.randn(64).astype(np.float32)
        next_state[0] = current_price
        
        done = self.current_step >= self.max_steps
        truncated = False
        info = {'inventory': self.inventory, 'mtm_value': mtm_value}
        
        return next_state, float(reward), done, truncated, info

    def reset(self, seed=None, options=None):
        super().reset(seed=seed)
        self.current_step = 0
        self.inventory = 0
        self.balance = 10000.0
        initial_state = np.random.randn(64).astype(np.float32)
        initial_state[0] = 150.0
        return initial_state, {}

    def render(self, mode='human'):
        print(f"Step: {self.current_step}")

    def close(self):
        pass
