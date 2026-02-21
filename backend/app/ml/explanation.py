from typing import List, Dict
import httpx
from app.core.config import settings

class AIExplanationEngine:
    """
    LLM-based engine to explain portfolio decisions and market regimes.
    """
    
    def __init__(self, provider: str = "openai"):
        self.provider = provider

    async def generate_explanation(self, portfolio_data: Dict, market_regime: str) -> str:
        """
        Produce a plain-English explanation of why the portfolio is positioned this way.
        """
        prompt = f"""
        As a senior hedge fund strategist, explain the following portfolio positioning:
        Portfolio Assets: {portfolio_data.get('assets')}
        Current Market Regime: {market_regime}
        Factor Exposures: {portfolio_data.get('factors')}
        
        Provide a concise, institutional-grade analysis for the client.
        """
        
        # Placeholder for actual LLM call
        return f"AURUM AI Analysis: The portfolio is currently tilted towards high-quality and low-volatility factors to navigate the detected '{market_regime}' regime. This defensive posture aims to mitigate tail-risk while maintaining exposure to momentum leaders."

    async def analyze_sentiment(self, news_headlines: List[str]) -> float:
        """
        Aggregate sentiment score from -1 to 1.
        """
        return 0.45 # Mock score
