import asyncio
import re
from typing import Dict, List, Tuple
from datetime import datetime

from ..models import CompanyDoc, AgentScore

class RiskOracleAgent:
    """Red-flag and dilution/failure predictors"""
    
    def __init__(self):
        self.name = "risk_oracle"
        
        # Risk patterns and weights
        self.risk_patterns = {
            "regulatory": {
                "patterns": ["crypto", "gambling", "cannabis", "financial services", "healthcare data"],
                "weight": 0.8,
                "description": "High regulatory risk"
            },
            "technical": {
                "patterns": ["ai", "blockchain", "quantum", "nuclear", "biotech"],
                "weight": 0.6,
                "description": "High technical complexity risk"
            },
            "market": {
                "patterns": ["first mover", "new category", "behavior change", "education required"],
                "weight": 0.5,
                "description": "Market adoption risk"
            },
            "competitive": {
                "patterns": ["google", "amazon", "facebook", "apple", "microsoft"],
                "weight": 0.7,
                "description": "Big tech competition risk"
            },
            "operational": {
                "patterns": ["single founder", "no technical co-founder", "outsourced development"],
                "weight": 0.6,
                "description": "Operational execution risk"
            }
        }
        
        # Failure predictors based on stage
        self.failure_indicators = {
            1: ["no market research", "no validation", "complex solution"],
            2: ["no customer feedback", "no traction", "burning cash"],
            3: ["high churn", "poor unit economics", "no product-market fit"],
            4: ["scaling issues", "team conflicts", "funding gaps"],
            5: ["market saturation", "competitive pressure", "operational challenges"],
            6: ["declining growth", "legacy technology", "management issues"],
            7: ["failed pivot", "cash flow problems", "team exodus"],
            8: ["valuation concerns", "due diligence issues", "market downturn"]
        }
    
    async def evaluate(self, company_doc: CompanyDoc) -> AgentScore:
        """Evaluate risk factors and failure probability"""
        
        # Assess different risk categories
        risk_scores = self._assess_risk_categories(company_doc)
        
        # Check for failure indicators
        failure_risk = self._assess_failure_indicators(company_doc)
        
        # Calculate overall risk score (inverted - higher score = lower risk)
        overall_risk = sum(risk_scores.values()) / len(risk_scores)
        failure_adjustment = 1.0 - failure_risk
        
        final_score = (1.0 - overall_risk) * failure_adjustment
        
        # Generate risk insights
        insights = self._generate_risk_insights(company_doc, risk_scores, failure_risk)
        
        return AgentScore(
            agent_name=self.name,
            score=max(final_score, 0.0),
            confidence=0.75,
            reasoning=insights["reasoning"],
            red_flags=insights["red_flags"],
            recommendations=insights["recommendations"]
        )
    
    def _assess_risk_categories(self, company_doc: CompanyDoc) -> Dict[str, float]:
        """Assess risk across different categories"""
        
        content = (
            company_doc.description + " " + 
            (company_doc.business_model or "") + " " + 
            (company_doc.team_info or "")
        ).lower()
        
        risk_scores = {}
        
        for risk_type, risk_data in self.risk_patterns.items():
            # Check for risk pattern matches
            matches = sum(1 for pattern in risk_data["patterns"] if pattern in content)
            
            if matches > 0:
                # Risk detected - calculate severity
                risk_severity = min(matches * 0.3, 1.0) * risk_data["weight"]
                risk_scores[risk_type] = risk_severity
            else:
                risk_scores[risk_type] = 0.1  # Baseline risk
        
        return risk_scores
    
    def _assess_failure_indicators(self, company_doc: CompanyDoc) -> float:
        """Assess stage-specific failure indicators"""
        
        stage_indicators = self.failure_indicators.get(company_doc.stage, [])
        content = (company_doc.description + " " + (company_doc.team_info or "")).lower()
        
        # Check for failure indicators
        indicator_matches = 0
        for indicator in stage_indicators:
            if any(word in content for word in indicator.split()):
                indicator_matches += 1
        
        # Calculate failure risk (0 = no risk, 1 = high risk)
        if len(stage_indicators) > 0:
            failure_risk = indicator_matches / len(stage_indicators)
        else:
            failure_risk = 0.2  # Default baseline
        
        # Additional risk factors
        if company_doc.stage > 3 and not company_doc.financials:
            failure_risk += 0.2  # No financials at later stage
        
        if company_doc.team_info and len(company_doc.team_info) < 50:
            failure_risk += 0.15  # Insufficient team info
        
        return min(failure_risk, 1.0)
    
    def _generate_risk_insights(self, company_doc: CompanyDoc, risk_scores: Dict[str, float], failure_risk: float) -> Dict:
        """Generate risk-based insights and recommendations"""
        
        red_flags = []
        recommendations = []
        
        # Identify high-risk areas
        high_risks = [(risk_type, score) for risk_type, score in risk_scores.items() if score > 0.5]
        
        for risk_type, score in high_risks:
            risk_info = self.risk_patterns[risk_type]
            red_flags.append(f"{risk_info['description']} (severity: {score:.1%})")
            
            # Risk-specific recommendations
            if risk_type == "regulatory":
                recommendations.append("Conduct regulatory compliance assessment")
                recommendations.append("Engage with regulatory experts early")
            elif risk_type == "technical":
                recommendations.append("Build technical proof-of-concept")
                recommendations.append("Assess technical feasibility with experts")
            elif risk_type == "market":
                recommendations.append("Validate market assumptions with research")
                recommendations.append("Develop customer education strategy")
            elif risk_type == "competitive":
                recommendations.append("Develop strong competitive differentiation")
                recommendations.append("Consider strategic partnerships")
            elif risk_type == "operational":
                recommendations.append("Strengthen founding team capabilities")
                recommendations.append("Develop operational excellence practices")
        
        # Failure risk warnings
        if failure_risk > 0.6:
            red_flags.append(f"High failure risk indicators for stage {company_doc.stage}")
            recommendations.append("Address critical success factors immediately")
        
        # Stage-specific recommendations
        if company_doc.stage <= 3 and failure_risk > 0.4:
            recommendations.append("Focus on customer validation and traction")
        elif company_doc.stage > 3 and not company_doc.financials:
            red_flags.append("Missing financial data for growth stage")
            recommendations.append("Implement robust financial tracking")
        
        # Default recommendations if none triggered
        if not recommendations:
            recommendations = [
                "Conduct regular risk assessment",
                "Build contingency plans for key risks",
                "Monitor industry and competitive changes"
            ]
        
        # Generate reasoning
        top_risks = sorted(high_risks, key=lambda x: x[1], reverse=True)[:2]
        if top_risks:
            risk_summary = ", ".join([f"{risk[0]} ({risk[1]:.1%})" for risk in top_risks])
            reasoning = f"Key risks identified: {risk_summary}. Overall failure risk: {failure_risk:.1%}"
        else:
            reasoning = f"Low to moderate risk profile. Failure risk: {failure_risk:.1%}"
        
        return {
            "reasoning": reasoning,
            "red_flags": red_flags[:4],  # Limit to top 4
            "recommendations": recommendations[:3]  # Limit to top 3
        }