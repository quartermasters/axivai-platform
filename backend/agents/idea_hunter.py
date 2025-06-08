import asyncio
from typing import List
import openai
import os

from ..models import CompanyDoc, AgentScore

class IdeaHunterAgent:
    """LLM-driven feasibility and originality detection"""
    
    def __init__(self):
        self.name = "idea_hunter"
        openai.api_key = os.getenv("OPENAI_API_KEY")
    
    async def evaluate(self, company_doc: CompanyDoc) -> AgentScore:
        """Evaluate idea feasibility and originality"""
        
        prompt = f"""
        Evaluate this startup idea for feasibility and originality:
        
        Company: {company_doc.name}
        Stage: {company_doc.stage}
        Description: {company_doc.description}
        Business Model: {company_doc.business_model or 'Not specified'}
        
        Assess on a 0-1 scale:
        1. Technical feasibility 
        2. Market timing
        3. Originality vs existing solutions
        4. Implementation complexity
        
        Identify any red flags or concerns.
        Provide 2-3 specific recommendations.
        
        Respond in JSON format:
        {{
            "feasibility_score": 0.0-1.0,
            "originality_score": 0.0-1.0, 
            "overall_score": 0.0-1.0,
            "confidence": 0.0-1.0,
            "reasoning": "explanation",
            "red_flags": ["flag1", "flag2"],
            "recommendations": ["rec1", "rec2", "rec3"]
        }}
        """
        
        try:
            response = await openai.ChatCompletion.acreate(
                model="gpt-4",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.3,
                max_tokens=1000
            )
            
            import json
            result = json.loads(response.choices[0].message.content)
            
            return AgentScore(
                agent_name=self.name,
                score=result["overall_score"],
                confidence=result["confidence"],
                reasoning=result["reasoning"],
                red_flags=result.get("red_flags", []),
                recommendations=result.get("recommendations", [])
            )
            
        except Exception as e:
            # Fallback scoring
            return AgentScore(
                agent_name=self.name,
                score=0.5,
                confidence=0.3,
                reasoning=f"Error in evaluation: {str(e)}",
                red_flags=["Agent evaluation failed"],
                recommendations=["Review idea description", "Provide more details"]
            )