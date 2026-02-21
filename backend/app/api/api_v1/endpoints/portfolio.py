from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.db import get_db
from app.quant.optimization import PortfolioOptimizer
from app.ml.regime_detection import MarketRegimeDetector
import numpy as np

router = APIRouter()

@router.get("/optimize")
def get_optimized_portfolio(db: Session = Depends(get_db)):
    """
    Apply Institutional Optimization based on current market regimes.
    """
    rng = np.random.default_rng()
    returns = rng.normal(0.01, 0.02, (100, 5))
    cov = np.cov(returns.T)
    exp_returns = np.mean(returns, axis=0)
    
    # 1. Detect Regime
    detector = MarketRegimeDetector()
    regimes, _, _ = detector.fit_predict(returns[:, 0])
    current_regime = int(regimes[-1])
    
    # 2. Optimize weights
    weights = PortfolioOptimizer.mean_variance(exp_returns, cov)
    
    return {
        "status": "success",
        "regime": current_regime,
        "optimal_weights": weights.tolist() if weights is not None else None,
        "analysis": "Regime detected: " + str(current_regime)
    }

@router.get("/simulation")
def get_simulation():
    """
    Generate Monte Carlo simulation paths for the portfolio.
    """
    rng = np.random.default_rng()
    iterations = 50
    days = 252
    
    # Generate random paths
    paths = []
    for _ in range(iterations):
        # Brownian motion roughly
        returns = rng.normal(0.0005, 0.01, days)
        price_path = np.exp(np.cumsum(returns)) * 100
        paths.append(price_path.tolist())
    
    return {
        "paths": paths,
        "stats": {
            "expected_return": 12.5,
            "volatility": 18.2,
            "var_95": 4.2
        }
    }

@router.get("/frontier")
def get_frontier():
    """
    Generate points for the Efficient Frontier curve.
    """
    rng = np.random.default_rng()
    num_points = 20
    risks = np.linspace(0.05, 0.25, num_points)
    returns = np.sqrt(risks) * 0.5 + 0.02 # Simple concave curve
    
    # Add some noise to make it look real
    returns += rng.normal(0, 0.002, num_points)
    
    points = [{"risk": r, "return": ret} for r, ret in zip(risks, returns)]
    
    return {
        "points": points,
        "optimal_point": {"risk": 0.12, "return": 0.08}
    }

@router.get("/market/ohlc")
def get_market_ohlc(symbol: str = "BTC/USD"):
    """
    Generate deterministic mock OHLC data based on symbol string.
    """
    # Create a seed from symbol name for visual variety
    symbol_seed = sum(ord(c) for c in symbol)
    rng = np.random.default_rng(symbol_seed)
    
    num_candles = 60
    prices = []
    # Start price varies by symbol
    current_price = 100.0 + (symbol_seed % 50000)
    
    volatility = 0.01 + (rng.random() * 0.05)
    
    for i in range(num_candles):
        # Weighted walk
        change_pct = rng.normal(0, volatility)
        open_p = current_price
        close_p = open_p * (1 + change_pct)
        
        # Ensure high/low are valid
        high_p = max(open_p, close_p) * (1 + rng.uniform(0, 0.01))
        low_p = min(open_p, close_p) * (1 - rng.uniform(0, 0.01))
        
        prices.append({
            "time": i,
            "open": round(open_p, 2),
            "high": round(high_p, 2),
            "low": round(low_p, 2),
            "close": round(close_p, 2),
            "volume": round(rng.uniform(10, 1000), 2)
        })
        current_price = close_p
        
    return {"symbol": symbol, "data": prices}

@router.get("/portfolio/allocation")
def get_allocation():
    """
    Portfolio allocation by sector and asset class.
    """
    sectors = [
        {"name": "Technology", "value": 35, "color": "#FFD700"},
        {"name": "Finance", "value": 20, "color": "#B8860B"},
        {"name": "Healthcare", "value": 15, "color": "#DAA520"},
        {"name": "Energy", "value": 12, "color": "#8B6508"},
        {"name": "Consumer", "value": 10, "color": "#CD9B1D"},
        {"name": "Others", "value": 8, "color": "#EEB422"},
    ]
    
    assets = [
        {"name": "Equities", "value": 60, "growth": 12.5},
        {"name": "Fixed Income", "value": 25, "growth": 4.2},
        {"name": "Commodities", "value": 10, "growth": -2.1},
        {"name": "Crypto", "value": 5, "growth": 45.8},
    ]
    
    return {"sectors": sectors, "assets": assets}

@router.get("/trades/history")
def get_trades():
    """
    Recent trade history feed with expanded symbol list.
    """
    rng = np.random.default_rng()
    symbols = [
        "AAPL", "MSFT", "GOOGL", "AMZN", "NVDA", "TSLA", "META", "AVGO", "PEP", "COST",
        "BTC/USD", "ETH/USD", "SOL/USD", "BNB/USD", "XRP/USD", "ADA/USD",
        "GOLD", "SILVER", "OIL", "NATGAS", "CORN", "WHEAT",
        "NFLX", "ADBE", "INTC", "CSCO", "ORCL", "CRM", "AMD", "QCOM",
        "JPM", "BAC", "WFC", "C", "GS", "MS",
        "V", "MA", "PYPL", "SQ",
        "DIS", "NFLX", "CMCSA", "TMUS", "VZ"
    ]
    types = ["BUY", "SELL"]
    
    trades = []
    for i in range(25): # Increased to 25 trades
        trades.append({
            "id": f"TX-{1000 + i}",
            "symbol": rng.choice(symbols),
            "type": rng.choice(types),
            "amount": round(rng.uniform(0.1, 50.0), 4),
            "price": round(rng.uniform(10.0, 70000.0), 2),
            "timestamp": "2024-03-21T14:30:00Z",
            "status": "COMPLETED"
        })
        
    return {"trades": trades}
