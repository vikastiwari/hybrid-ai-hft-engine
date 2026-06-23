import numpy as np

class BaseAgent:
    def __init__(self, name):
        self.name = name

    def predict(self, observation):
        raise NotImplementedError

class OmegaAgent(BaseAgent):
    """Strategic Risk Manager (Minutes-Hours). Determines overall portfolio bias."""
    def __init__(self):
        super().__init__("Omega")
        self.current_bias = 0.0 # -1.0 to 1.0

    def predict(self, observation, sentiment_vector):
        # Incorporates NLP Sentiment and Macro trends
        # Returns a strategic option, e.g., Initialize_Long_Bias
        # Mock logic
        sentiment_score = sentiment_vector[0] if sentiment_vector is not None else 0.0
        if sentiment_score > 0.5:
            self.current_bias = 1.0
        elif sentiment_score < -0.5:
            self.current_bias = -1.0
        return np.array([self.current_bias, 0, 0, 0], dtype=np.float32)

class BetaAgent(BaseAgent):
    """Tactical Swing Trader (Seconds-Minutes). Executes Omega's bias."""
    def __init__(self):
        super().__init__("Beta")

    def predict(self, observation, omega_bias):
        # Reads VWAP deviations and order book imbalances
        # Sets dynamic limit prices
        action = np.zeros(4, dtype=np.float32)
        if omega_bias > 0.5:
            action[0] = 0.8 # Strong buy signal
        elif omega_bias < -0.5:
            action[0] = -0.8 # Strong sell signal
        return action

class AlphaAgent(BaseAgent):
    """Microstructure Scalper (Microseconds). Executes Beta's constraints."""
    def __init__(self):
        super().__init__("Alpha")

    def predict(self, observation, beta_action):
        # Hyper-focused on L1/L2 limit order book queue position
        # Decides the exact microsecond to inject or cancel an OUCH order
        # Action space: [signal, price, qty, timeout]
        
        # Add microstructure noise/optimization
        final_action = np.copy(beta_action)
        
        # If signal is weak, don't execute at tick level
        if abs(final_action[0]) < 0.2:
            final_action[0] = 0.0
            
        return final_action
