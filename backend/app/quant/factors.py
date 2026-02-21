import numpy as np
import pandas as pd
from typing import Dict, Any

class FactorModel:
    """
    Institutional engine for Factor-based Analysis.
    Supports Fama-French 3 and 5 factor models.
    """
    
    @staticmethod
    def calculate_betas(returns: pd.Series, factor_returns: pd.DataFrame) -> Dict[str, float]:
        """
        Calculate factor exposures (betas) via OLS regression.
        """
        import statsmodels.api as sm
        
        # Align data
        data = pd.concat([returns, factor_returns], axis=1).dropna()
        y = data.iloc[:, 0]
        X = data.iloc[:, 1:]
        X = sm.add_constant(X)
        
        model = sm.OLS(y, X).fit()
        return model.params.to_dict()

    @staticmethod
    def momentum_factor(prices: pd.Series, window: int = 252) -> float:
        """
        Momentum (12-1): Performance from 12 months ago to 1 month ago.
        """
        returns = prices.pct_change(21) # Approx 1 month
        momentum = (prices.shift(21) / prices.shift(252)) - 1
        return momentum.iloc[-1]

    @staticmethod
    def low_volatility(returns: pd.Series, window: int = 252) -> float:
        return returns.tail(window).std() * np.sqrt(252)
