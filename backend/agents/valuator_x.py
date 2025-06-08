import asyncio
import math
from typing import Dict, List, Optional, Tuple

from ..models import CompanyDoc, AgentScore

class ValuatorXAgent:
    """Valuation-band estimator via market and traction alignment"""
    
    def __init__(self):
        self.name = "valuator_x"
        
        # Market valuation multiples by industry and stage
        self.valuation_multiples = {
            "saas": {
                "early": {"revenue": 8, "gmv": 2, "users": 50},
                "growth": {"revenue": 12, "gmv": 3, "users": 80},
                "mature": {"revenue": 6, "gmv": 1.5, "users": 30}
            },
            "marketplace": {
                "early": {"revenue": 10, "gmv": 1.5, "users": 100},
                "growth": {"revenue": 15, "gmv": 2, "users": 150},
                "mature": {"revenue": 8, "gmv": 1, "users": 60}
            },
            "fintech": {
                "early": {"revenue": 6, "gmv": 1, "users": 40},
                "growth": {"revenue": 10, "gmv": 1.5, "users": 70},
                "mature": {"revenue": 5, "gmv": 0.8, "users": 25}
            },
            "healthtech": {
                "early": {"revenue": 12, "gmv": 3, "users": 200},
                "growth": {"revenue": 18, "gmv": 4, "users": 300},
                "mature": {"revenue": 10, "gmv": 2, "users": 150}
            },
            "default": {
                "early": {"revenue": 5, "gmv": 1, "users": 30},
                "growth": {"revenue": 8, "gmv": 1.5, "users": 50},
                "mature": {"revenue": 4, "gmv": 0.8, "users": 20}
            }
        }
        
        # Stage-based valuation expectations
        self.stage_expectations = {
            1: {"min": 0, "max": 500000, "median": 100000},        # Pre-seed
            2: {"min": 100000, "max": 2000000, "median": 500000}, # Seed
            3: {"min": 500000, "max": 10000000, "median": 3000000}, # Series A
            4: {"min": 5000000, "max": 50000000, "median": 15000000}, # Series B
            5: {"min": 20000000, "max": 200000000, "median": 60000000}, # Series C+
            6: {"min": 50000000, "max": 1000000000, "median": 200000000}, # Late stage
            7: {"min": 10000000, "max": 100000000, "median": 30000000}, # Turnaround
            8: {"min": 100000000, "max": 10000000000, "median": 500000000} # Pre-exit
        }
    
    async def evaluate(self, company_doc: CompanyDoc) -> AgentScore:
        """Estimate valuation band and score alignment"""
        
        # Identify industry and stage category
        industry = self._identify_industry(company_doc)
        stage_category = self._get_stage_category(company_doc.stage)
        
        # Calculate valuation estimates
        valuation_estimates = self._calculate_valuations(company_doc, industry, stage_category)
        
        # Assess valuation reasonableness
        valuation_score = self._assess_valuation_reasonableness(
            company_doc.stage, valuation_estimates
        )
        
        # Generate valuation insights
        insights = self._generate_valuation_insights(
            company_doc, valuation_estimates, valuation_score
        )
        
        return AgentScore(
            agent_name=self.name,
            score=valuation_score,
            confidence=0.65,  # Valuation is inherently uncertain
            reasoning=insights["reasoning"],
            red_flags=insights["red_flags"],
            recommendations=insights["recommendations"]
        )
    
    def _identify_industry(self, company_doc: CompanyDoc) -> str:
        """Identify industry from company description"""
        
        description = (company_doc.description + " " + (company_doc.business_model or "")).lower()
        
        # Industry detection patterns
        if any(term in description for term in ["saas", "software", "subscription"]):
            return "saas"
        elif any(term in description for term in ["marketplace", "platform", "connect"]):
            return "marketplace"
        elif any(term in description for term in ["fintech", "financial", "payments", "banking"]):
            return "fintech"
        elif any(term in description for term in ["health", "medical", "healthcare", "biotech"]):
            return "healthtech"
        else:
            return "default"
    
    def _get_stage_category(self, stage: int) -> str:
        """Map lifecycle stage to valuation category"""
        if stage <= 3:
            return "early"
        elif stage <= 6:
            return "growth"
        else:
            return "mature"
    
    def _calculate_valuations(self, company_doc: CompanyDoc, industry: str, stage_category: str) -> Dict[str, Optional[float]]:
        """Calculate multiple valuation estimates"""
        
        multiples = self.valuation_multiples.get(industry, self.valuation_multiples["default"])[stage_category]
        financials = company_doc.financials or {}
        
        valuations = {}
        
        # Revenue multiple
        if "revenue" in financials or "arr" in financials or "mrr" in financials:
            revenue = financials.get("revenue", 0)
            if "arr" in financials:
                revenue = financials["arr"]
            elif "mrr" in financials:
                revenue = financials["mrr"] * 12
            
            if revenue > 0:
                valuations["revenue_multiple"] = revenue * multiples["revenue"]
        
        # GMV multiple (for marketplaces)
        if "gmv" in financials and financials["gmv"] > 0:
            valuations["gmv_multiple"] = financials["gmv"] * multiples["gmv"]
        
        # User-based valuation
        if "users" in financials or "customers" in financials:
            user_count = financials.get("users", financials.get("customers", 0))
            if user_count > 0:
                valuations["user_multiple"] = user_count * multiples["users"]
        
        # Comparable company method (simplified)
        if not valuations:
            # Use stage-based estimation if no metrics available
            stage_data = self.stage_expectations.get(company_doc.stage, self.stage_expectations[3])
            valuations["stage_based"] = stage_data["median"]
        
        return valuations
    
    def _assess_valuation_reasonableness(self, stage: int, estimates: Dict[str, Optional[float]]) -> float:
        """Score valuation reasonableness vs stage expectations"""
        
        if not estimates:
            return 0.3  # Low score for no valuation data
        
        stage_data = self.stage_expectations.get(stage, self.stage_expectations[3])
        
        # Calculate median estimate
        valid_estimates = [v for v in estimates.values() if v is not None and v > 0]
        if not valid_estimates:
            return 0.3
        
        median_estimate = sorted(valid_estimates)[len(valid_estimates) // 2]
        
        # Score against stage expectations
        if stage_data["min"] <= median_estimate <= stage_data["max"]:
            # Within reasonable range
            if abs(median_estimate - stage_data["median"]) / stage_data["median"] < 0.5:
                return 0.9  # Very reasonable
            else:
                return 0.7  # Reasonable but not optimal
        elif median_estimate < stage_data["min"]:
            # Undervalued - could be good or concerning
            ratio = median_estimate / stage_data["min"]
            return max(0.5 * ratio, 0.2)
        else:
            # Overvalued - concerning
            ratio = stage_data["max"] / median_estimate
            return max(0.4 * ratio, 0.1)
    
    def _generate_valuation_insights(
        self, 
        company_doc: CompanyDoc, 
        estimates: Dict[str, Optional[float]], 
        score: float
    ) -> Dict:
        """Generate valuation insights and recommendations"""
        
        red_flags = []
        recommendations = []
        
        stage_data = self.stage_expectations.get(company_doc.stage, self.stage_expectations[3])
        
        # Analyze estimates
        if estimates:
            valid_estimates = [v for v in estimates.values() if v is not None and v > 0]
            if valid_estimates:
                min_est = min(valid_estimates)
                max_est = max(valid_estimates)
                median_est = sorted(valid_estimates)[len(valid_estimates) // 2]
                
                # Check for wide valuation range
                if max_est / min_est > 3:
                    red_flags.append("Wide valuation range indicates uncertainty")
                    recommendations.append("Gather more comparable company data")
                
                # Check against stage expectations
                if median_est > stage_data["max"]:
                    red_flags.append("Valuation appears high for current stage")
                    recommendations.append("Focus on traction metrics to justify valuation")
                elif median_est < stage_data["min"]:
                    recommendations.append("Consider raising valuation with stronger metrics")
                
                # Generate valuation range
                valuation_range = f"${min_est/1000000:.1f}M - ${max_est/1000000:.1f}M"
                reasoning = f"Estimated valuation range: {valuation_range} based on {len(estimates)} methods"
            else:
                reasoning = "Insufficient financial data for reliable valuation"
                red_flags.append("No quantifiable metrics for valuation")
        else:
            reasoning = "No financial metrics available for valuation analysis"
            red_flags.append("Missing revenue, user, or traction data")
        
        # Stage-specific recommendations
        if company_doc.stage <= 2 and not company_doc.financials:
            recommendations.append("Focus on customer traction before seeking valuation")
        elif company_doc.stage >= 3 and not estimates:
            red_flags.append("Missing financial metrics expected at this stage")
            recommendations.append("Implement comprehensive financial tracking")
        
        # Default recommendations
        if not recommendations:
            recommendations = [
                "Track key valuation metrics (revenue, users, growth)",
                "Research comparable company valuations",
                "Focus on sustainable growth over valuation"
            ]
        
        return {
            "reasoning": reasoning,
            "red_flags": red_flags[:3],
            "recommendations": recommendations[:3]
        }