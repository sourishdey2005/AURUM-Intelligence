try:
    from hmmlearn.hmm import GaussianHMM
    HMM_AVAILABLE = True
except ImportError:
    HMM_AVAILABLE = False
import numpy as np
import pandas as pd

class MarketRegimeDetector:
    """
    HMM for Bull/Bear/Crash detection.
    """
    
    def __init__(self, n_states: int = 3):
        if HMM_AVAILABLE:
            self.model = GaussianHMM(
                n_components=n_states, 
                covariance_type="full", 
                n_iter=1000
            )
        else:
            self.model = None

    def fit_predict(self, returns: pd.Series):
        if not HMM_AVAILABLE:
            # Simple thresholding fallback if HMM is not available
            n = len(returns)
            regimes = np.array([1 if r > 0 else 0 for r in returns])
            return regimes, np.array([0, 0, 0]), np.array([0, 0, 0])

        X = returns.values.reshape(-1, 1)
        self.model.fit(X)
        regimes = self.model.predict(X)
        
        # Determine which regime is which by looking at mean/std
        means = self.model.means_.flatten()
        std_devs = np.sqrt(np.diag(self.model.covars_[0])) # Simplified
        
        return regimes, means, std_devs
