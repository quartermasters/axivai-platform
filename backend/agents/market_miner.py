import asyncio
import requests
import json
from typing import Dict, List

from ..models import CompanyDoc, AgentScore

class MarketMinerAgent:
    """TAM/SAM/SOM triangulation using external APIs"""
    
    def __init__(self):
        self.name = "market_miner"
        # Mock API endpoints - replace with real data sources
        self.data_sources = {
            "statista": "https://api.statista.com/v1/market-size",
            "cb_insights": "https://api.cbinsights.com/v1/market-data",
            "crunchbase": "https://api.crunchbase.com/v4/searches"
        }
    
    async def evaluate(self, company_doc: CompanyDoc) -> AgentScore:
        """Evaluate market size and opportunity"""
        
        # Extract market keywords from description
        market_keywords = self._extract_market_keywords(company_doc.description)
        
        # Fetch market data
        market_data = await self._fetch_market_data(market_keywords)
        
        # Calculate market scores
        tam_score = self._calculate_tam_score(market_data)
        competition_score = self._assess_competition(market_keywords)
        timing_score = self._assess_market_timing(company_doc.stage)
        
        overall_score = (tam_score * 0.4 + competition_score * 0.3 + timing_score * 0.3)
        
        # Generate insights
        red_flags = []
        recommendations = []
        
        if tam_score < 0.3:
            red_flags.append("Limited market size (<$1B TAM)")
            recommendations.append("Consider market expansion or niche focus")
        
        if competition_score < 0.4:
            red_flags.append("Highly saturated market")
            recommendations.append("Develop stronger differentiation strategy")
        
        reasoning = f"Market analysis: TAM score {tam_score:.1%}, Competition {competition_score:.1%}, Timing {timing_score:.1%}"
        
        return AgentScore(
            agent_name=self.name,
            score=overall_score,
            confidence=0.7,
            reasoning=reasoning,
            red_flags=red_flags,
            recommendations=recommendations if recommendations else ["Validate market assumptions", "Conduct customer interviews"]
        )
    
    def _extract_market_keywords(self, description: str) -> List[str]:
        """Extract relevant market/industry keywords"""
        # Simple keyword extraction - could use NLP
        common_markets = ["fintech", "healthtech", "edtech", "saas", "ecommerce", 
                         "ai", "blockchain", "iot", "mobile", "enterprise"]
        
        keywords = []
        description_lower = description.lower()
        for market in common_markets:
            if market in description_lower:
                keywords.append(market)
        
        return keywords if keywords else ["general"]
    
    async def _fetch_market_data(self, keywords: List[str]) -> Dict:
        """Mock market data fetching - replace with real APIs"""
        
        # Simulate market data lookup
        market_sizes = {
            "fintech": {"tam": 150000, "growth": 0.15},
            "healthtech": {"tam": 200000, "growth": 0.12},
            "edtech": {"tam": 80000, "growth": 0.18},
            "saas": {"tam": 300000, "growth": 0.10},
            "ecommerce": {"tam": 500000, "growth": 0.08},
            "ai": {"tam": 120000, "growth": 0.25},
            "blockchain": {"tam": 50000, "growth": 0.30},
            "general": {"tam": 100000, "growth": 0.05}
        }
        
        # Get data for primary keyword
        primary_keyword = keywords[0] if keywords else "general"
        return market_sizes.get(primary_keyword, market_sizes["general"])
    
    def _calculate_tam_score(self, market_data: Dict) -> float:
        """Score based on total addressable market size"""
        tam = market_data.get("tam", 0)  # in millions
        
        if tam >= 100000:  # $100B+
            return 1.0
        elif tam >= 50000:  # $50B+
            return 0.8
        elif tam >= 10000:  # $10B+
            return 0.6
        elif tam >= 1000:   # $1B+
            return 0.4
        else:
            return 0.2
    
    def _assess_competition(self, keywords: List[str]) -> float:
        """Mock competition assessment"""
        # In real implementation, query Crunchbase/CB Insights for competitor count
        competitive_markets = ["fintech", "saas", "ecommerce"]
        
        if any(kw in competitive_markets for kw in keywords):
            return 0.3  # High competition
        else:
            return 0.7  # Lower competition
    
    def _assess_market_timing(self, stage: int) -> float:
        """Assess if market timing aligns with startup stage"""
        # Early stages benefit from emerging markets
        if stage <= 3:
            return 0.8  # Good timing for early entry
        else:
            return 0.6  # Later entry