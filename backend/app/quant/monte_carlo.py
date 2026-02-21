import numpy as np
import pandas as pd

class MonteCarloEngine:
    """
    Fat-tail modeling and regime-based simulation engine.
    """
    
    def __init__(self, returns: pd.DataFrame, weights: np.array):
        self.returns = returns
        self.weights = weights
        self.mean_returns = returns.mean()
        self.cov_matrix = returns.cov()

    def run_simulation(self, iterations: int = 10000, days: int = 252):
        """
        Run Monte Carlo simulation using Geometric Brownian Motion or Fatigue Dist.
        """
        # Multi-variate normal simulation for now (can upgrade to fat-tails with T-distribution)
        portfolio_sims = np.zeros((iterations, days))
        
        for i in range(iterations):
            daily_returns = np.random.multivariate_normal(
                self.mean_returns, self.cov_matrix, days
            )
            portfolio_daily_returns = daily_returns @ self.weights
            portfolio_sims[i, :] = np.cumprod(1 + portfolio_daily_returns)
            
        return portfolio_sims

    def calculate_var(self, sims: np.array, confidence: float = 0.95):
        final_returns = sims[:, -1]
        return np.percentile(final_returns, (1 - confidence) * 100)
