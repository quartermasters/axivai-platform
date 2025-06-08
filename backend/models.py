from pydantic import BaseModel, Field
from typing import Dict, List, Optional, Any
from datetime import datetime
from enum import Enum

class LifecycleStage(int, Enum):
    IDEATION = 1
    VALIDATION = 2
    EARLY_TRACTION = 3
    GROWTH = 4
    EXPANSION = 5
    MATURITY = 6
    DECLINE_PIVOT = 7
    EXIT_PREP = 8

class Verdict(str, Enum):
    VALIDATE = "validate"
    CONDITIONAL = "conditional" 
    PIVOT = "pivot"
    INVALID = "invalid"

class CompanyDoc(BaseModel):
    """Structured startup data format (CompanyDoc v1)"""
    id: str
    name: str
    stage: LifecycleStage
    description: str
    market_size: Optional[str] = None
    business_model: Optional[str] = None
    team_info: Optional[str] = None
    financials: Dict[str, Any] = Field(default_factory=dict)
    submitted_by: str
    privacy_mode: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)

class AgentScore(BaseModel):
    """Individual agent evaluation result"""
    agent_name: str
    score: float = Field(ge=0.0, le=1.0)
    confidence: float = Field(ge=0.0, le=1.0)
    reasoning: str
    red_flags: List[str] = Field(default_factory=list)
    recommendations: List[str] = Field(default_factory=list)

class EvaluationResult(BaseModel):
    """Complete evaluation output"""
    id: str
    company_id: str
    verdict: Verdict
    overall_score: float = Field(ge=0.0, le=1.0)
    agent_scores: Dict[str, float]
    detailed_scores: List[AgentScore]
    explanation: str
    recommendations: List[str]
    stage_weights: Dict[str, float]
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    privacy_mode: bool = True

class InvestorProfile(BaseModel):
    """Investor matching profile"""
    id: str
    name: str
    type: str  # "vc", "angel", "corporate", "pe"
    stages: List[LifecycleStage]
    domains: List[str]
    regions: List[str]
    ticket_size_min: Optional[int] = None
    ticket_size_max: Optional[int] = None
    portfolio_companies: List[str] = Field(default_factory=list)
    investment_thesis: Optional[str] = None
    verified: bool = False

class MatchResult(BaseModel):
    """Startup-investor match result"""
    startup_id: str
    investor_id: str
    match_score: float = Field(ge=0.0, le=1.0)
    match_reasons: List[str]
    stage_alignment: float
    domain_alignment: float
    geographic_alignment: float
    thesis_alignment: Optional[float] = None

class UserProfile(BaseModel):
    """User account and preferences"""
    user_id: str
    email: str
    user_type: str  # "founder", "investor", "analyst"
    tier: str = "free"  # "free", "pro", "enterprise"
    reports_this_month: int = 0
    privacy_preferences: Dict[str, bool] = Field(default_factory=dict)
    created_at: datetime = Field(default_factory=datetime.utcnow)