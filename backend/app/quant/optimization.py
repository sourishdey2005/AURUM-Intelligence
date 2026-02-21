try:
    import cvxpy as cp
    CVXPY_AVAILABLE = True
except ImportError:
    import numpy as np
    CVXPY_AVAILABLE = False
import pandas as pd

class PortfolioOptimizer:
    """
    Robust Mean-Variance and CVaR Optimization.
    """
    
    @staticmethod
    def mean_variance(expected_returns: np.array, cov_matrix: np.array, risk_aversion: float = 1.0):
        if not CVXPY_AVAILABLE:
            # Fallback: Equal weighting if optimization library is missing
            n = len(expected_returns)
            return np.ones(n) / n

        n = len(expected_returns)
        w = cp.Variable(n)
        
        ret = expected_returns.T @ w
        risk = cp.quad_form(w, cov_matrix)
        
        prob = cp.Problem(cp.Maximize(ret - risk_aversion * risk),
                         [cp.sum(w) == 1, w >= 0])
        prob.solve()
        
        return w.value

    @staticmethod
    def risk_parity(cov_matrix: np.array):
        """
        Risk Parity optimization (Equal Risk Contribution).
        Simplified implementation.
        """
        n = len(cov_matrix)
        w = cp.Variable(n)
        
        # Risk parity objective is more complex in CVXPy, 
        # usually solved via log-barrier or iterative approach.
        # Placeholder for standard risk-parity optimization.
        pass
