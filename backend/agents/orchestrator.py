import asyncio
from typing import Dict, List
from datetime import datetime
import uuid

from ..models import CompanyDoc, EvaluationResult, AgentScore, Verdict
from .idea_hunter import IdeaHunterAgent
from .market_miner import MarketMinerAgent
from .model_judge import ModelJudgeAgent
from .risk_oracle import RiskOracleAgent
from .valuator_x import ValuatorXAgent

class AgentOrchestrator:
    """Orchestrates hybrid AI agent evaluation pipeline"""
    
    def __init__(self):
        self.agents = {
            "idea_hunter": IdeaHunterAgent(),
            "market_miner": MarketMinerAgent(), 
            "model_judge": ModelJudgeAgent(),
            "risk_oracle": RiskOracleAgent(),
            "valuator_x": ValuatorXAgent()
        }
        
        # Stage-aware weighting matrix (from PRD Appendix A)
        self.stage_weights = {
            1: {"idea_hunter": 0.4, "market_miner": 0.3, "model_judge": 0.2, "risk_oracle": 0.05, "valuator_x": 0.05},
            2: {"idea_hunter": 0.3, "market_miner": 0.4, "model_judge": 0.2, "risk_oracle": 0.05, "valuator_x": 0.05},
            3: {"idea_hunter": 0.2, "market_miner": 0.3, "model_judge": 0.3, "risk_oracle": 0.1, "valuator_x": 0.1},
            4: {"idea_hunter": 0.1, "market_miner": 0.2, "model_judge": 0.3, "risk_oracle": 0.2, "valuator_x": 0.2},
            5: {"idea_hunter": 0.05, "market_miner": 0.15, "model_judge": 0.3, "risk_oracle": 0.25, "valuator_x": 0.25},
            6: {"idea_hunter": 0.05, "market_miner": 0.1, "model_judge": 0.2, "risk_oracle": 0.3, "valuator_x": 0.35},
            7: {"idea_hunter": 0.1, "market_miner": 0.2, "model_judge": 0.3, "risk_oracle": 0.2, "valuator_x": 0.2},
            8: {"idea_hunter": 0.05, "market_miner": 0.1, "model_judge": 0.15, "risk_oracle": 0.2, "valuator_x": 0.5}
        }
    
    async def evaluate(self, company_doc: CompanyDoc) -> EvaluationResult:
        """Main evaluation pipeline"""
        
        # Get stage-specific weights
        weights = self.stage_weights.get(company_doc.stage, self.stage_weights[3])
        
        # Run agents in parallel
        agent_tasks = []
        for agent_name, agent in self.agents.items():
            task = asyncio.create_task(agent.evaluate(company_doc))
            agent_tasks.append((agent_name, task))
        
        # Collect results
        agent_scores = {}
        detailed_scores = []
        all_recommendations = []
        
        for agent_name, task in agent_tasks:
            try:
                score_result = await task
                agent_scores[agent_name] = score_result.score
                detailed_scores.append(score_result)
                all_recommendations.extend(score_result.recommendations)
            except Exception as e:
                # Graceful degradation
                print(f"Agent {agent_name} failed: {e}")
                agent_scores[agent_name] = 0.5  # Neutral score
        
        # Calculate weighted overall score
        overall_score = sum(
            agent_scores[agent] * weights[agent] 
            for agent in weights.keys() 
            if agent in agent_scores
        )
        
        # Determine verdict based on score and red flags
        verdict = self._determine_verdict(overall_score, detailed_scores)
        
        # Generate explanation
        explanation = self._generate_explanation(
            company_doc, overall_score, detailed_scores, weights
        )
        
        return EvaluationResult(
            id=str(uuid.uuid4()),
            company_id=company_doc.id,
            verdict=verdict,
            overall_score=overall_score,
            agent_scores=agent_scores,
            detailed_scores=detailed_scores,
            explanation=explanation,
            recommendations=list(set(all_recommendations))[:5],  # Top 5 unique
            stage_weights=weights,
            privacy_mode=company_doc.privacy_mode
        )
    
    def _determine_verdict(self, score: float, detailed_scores: List[AgentScore]) -> Verdict:
        """Apply verdict logic with red flag consideration"""
        
        # Check for critical red flags
        critical_flags = []
        for agent_result in detailed_scores:
            critical_flags.extend([
                flag for flag in agent_result.red_flags 
                if any(keyword in flag.lower() for keyword in ["fraud", "illegal", "violation"])
            ])
        
        if critical_flags:
            return Verdict.INVALID
        
        # Score-based thresholds
        if score >= 0.75:
            return Verdict.VALIDATE
        elif score >= 0.5:
            return Verdict.CONDITIONAL
        elif score >= 0.25:
            return Verdict.PIVOT
        else:
            return Verdict.INVALID
    
    def _generate_explanation(
        self, 
        company_doc: CompanyDoc, 
        overall_score: float,
        detailed_scores: List[AgentScore],
        weights: Dict[str, float]
    ) -> str:
        """Generate human-readable explanation"""
        
        top_agents = sorted(
            [(name, score.score * weights.get(name, 0)) for name, score in 
             zip([s.agent_name for s in detailed_scores], detailed_scores)],
            key=lambda x: x[1], reverse=True
        )[:3]
        
        explanation = f"Based on stage {company_doc.stage} evaluation, "
        explanation += f"your startup scored {overall_score:.1%} overall. "
        explanation += f"Key factors: {', '.join([agent[0].replace('_', ' ').title() for agent in top_agents])}."
        
        return explanation