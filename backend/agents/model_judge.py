import asyncio
from typing import Dict, List, Tuple

from ..models import CompanyDoc, AgentScore

class ModelJudgeAgent:
    """Business model viability scoring"""
    
    def __init__(self):
        self.name = "model_judge"
        
        # Business model templates and their viability patterns
        self.model_patterns = {
            "saas": {
                "recurring_revenue": 0.9,
                "scalability": 0.8,
                "customer_acquisition": 0.6,
                "margin_profile": 0.8
            },
            "marketplace": {
                "network_effects": 0.9,
                "scalability": 0.9,
                "customer_acquisition": 0.4,
                "margin_profile": 0.6
            },
            "freemium": {
                "recurring_revenue": 0.7,
                "scalability": 0.8,
                "customer_acquisition": 0.8,
                "margin_profile": 0.5
            },
            "subscription": {
                "recurring_revenue": 0.9,
                "scalability": 0.7,
                "customer_acquisition": 0.6,
                "margin_profile": 0.7
            },
            "transaction": {
                "recurring_revenue": 0.3,
                "scalability": 0.6,
                "customer_acquisition": 0.5,
                "margin_profile": 0.7
            }
        }
    
    async def evaluate(self, company_doc: CompanyDoc) -> AgentScore:
        """Evaluate business model viability"""
        
        # Identify business model type
        model_type = self._identify_model_type(company_doc)
        
        # Assess key viability dimensions
        viability_scores = self._assess_viability_dimensions(company_doc, model_type)
        
        # Calculate stage-adjusted score
        stage_adjustment = self._get_stage_adjustment(company_doc.stage)
        overall_score = sum(viability_scores.values()) / len(viability_scores) * stage_adjustment
        
        # Generate insights
        insights = self._generate_insights(company_doc, model_type, viability_scores)
        
        return AgentScore(
            agent_name=self.name,
            score=min(overall_score, 1.0),
            confidence=0.8,
            reasoning=insights["reasoning"],
            red_flags=insights["red_flags"],
            recommendations=insights["recommendations"]
        )
    
    def _identify_model_type(self, company_doc: CompanyDoc) -> str:
        """Identify business model from description"""
        
        description = (company_doc.description + " " + (company_doc.business_model or "")).lower()
        
        # Model detection patterns
        if any(term in description for term in ["saas", "software as a service", "monthly subscription"]):
            return "saas"
        elif any(term in description for term in ["marketplace", "platform", "connect buyers"]):
            return "marketplace"
        elif any(term in description for term in ["freemium", "free tier", "premium features"]):
            return "freemium"
        elif any(term in description for term in ["subscription", "recurring payment", "monthly fee"]):
            return "subscription"
        elif any(term in description for term in ["transaction", "commission", "per transaction"]):
            return "transaction"
        else:
            return "transaction"  # Default fallback
    
    def _assess_viability_dimensions(self, company_doc: CompanyDoc, model_type: str) -> Dict[str, float]:
        """Assess key business model dimensions"""
        
        base_scores = self.model_patterns.get(model_type, self.model_patterns["transaction"])
        
        # Adjust based on available information
        adjusted_scores = base_scores.copy()
        
        # Financial data adjustments
        if company_doc.financials:
            if "revenue" in company_doc.financials:
                adjusted_scores["recurring_revenue"] *= 1.2
            if "gross_margin" in company_doc.financials:
                margin = company_doc.financials.get("gross_margin", 0)
                if margin > 0.7:
                    adjusted_scores["margin_profile"] *= 1.3
                elif margin < 0.3:
                    adjusted_scores["margin_profile"] *= 0.7
        
        # Team quality impact
        if company_doc.team_info and len(company_doc.team_info) > 100:
            for key in adjusted_scores:
                adjusted_scores[key] *= 1.1
        
        return {k: min(v, 1.0) for k, v in adjusted_scores.items()}
    
    def _get_stage_adjustment(self, stage: int) -> float:
        """Adjust scoring based on lifecycle stage expectations"""
        
        # Different stages have different model maturity expectations
        stage_multipliers = {
            1: 0.7,  # Ideation - models can be theoretical
            2: 0.8,  # Validation - early model validation
            3: 0.9,  # Early traction - model proving
            4: 1.0,  # Growth - model should be proven
            5: 1.0,  # Expansion - model optimization
            6: 0.9,  # Maturity - may need model innovation
            7: 0.8,  # Decline/Pivot - model change expected
            8: 1.0   # Exit prep - model should be solid
        }
        
        return stage_multipliers.get(stage, 1.0)
    
    def _generate_insights(self, company_doc: CompanyDoc, model_type: str, scores: Dict[str, float]) -> Dict:
        """Generate reasoning, red flags, and recommendations"""
        
        red_flags = []
        recommendations = []
        
        # Check for concerning scores
        if scores["recurring_revenue"] < 0.4:
            red_flags.append("Low recurring revenue potential")
            recommendations.append("Consider subscription or recurring elements")
        
        if scores["scalability"] < 0.5:
            red_flags.append("Limited scalability in current model")
            recommendations.append("Identify leverage points for scaling")
        
        if scores["customer_acquisition"] < 0.4:
            red_flags.append("High customer acquisition challenges")
            recommendations.append("Develop viral or referral mechanisms")
        
        if scores["margin_profile"] < 0.5:
            red_flags.append("Concerning unit economics")
            recommendations.append("Focus on margin improvement strategies")
        
        # Model-specific recommendations
        if model_type == "marketplace" and scores["network_effects"] < 0.6:
            recommendations.append("Strengthen network effects and user engagement")
        
        if model_type == "saas" and not company_doc.financials.get("mrr"):
            recommendations.append("Track and optimize Monthly Recurring Revenue (MRR)")
        
        # Default recommendations if none triggered
        if not recommendations:
            recommendations = [
                "Validate revenue model with pilot customers",
                "Track key business model metrics",
                "Consider adjacent revenue streams"
            ]
        
        reasoning = f"Business model ({model_type}) analysis: " + \
                   f"Revenue potential {scores['recurring_revenue']:.1%}, " + \
                   f"Scalability {scores['scalability']:.1%}, " + \
                   f"CAC efficiency {scores['customer_acquisition']:.1%}"
        
        return {
            "reasoning": reasoning,
            "red_flags": red_flags,
            "recommendations": recommendations[:3]  # Limit to top 3
        }