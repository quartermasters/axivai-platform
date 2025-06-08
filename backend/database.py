from sqlalchemy import create_engine, Column, String, Integer, Float, Boolean, DateTime, JSON, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from datetime import datetime
import os

# Database configuration
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@localhost/axivai")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Database Models
class User(Base):
    __tablename__ = "users"
    
    user_id = Column(String, primary_key=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    user_type = Column(String)  # founder, investor, analyst
    tier = Column(String, default="free")
    reports_this_month = Column(Integer, default=0)
    privacy_preferences = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)
    is_active = Column(Boolean, default=True)

class Company(Base):
    __tablename__ = "companies"
    
    company_id = Column(String, primary_key=True)
    name = Column(String)
    stage = Column(Integer)
    description = Column(Text)
    market_size = Column(String)
    business_model = Column(String)
    team_info = Column(Text)
    financials = Column(JSON)
    submitted_by = Column(String)
    privacy_mode = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
class Evaluation(Base):
    __tablename__ = "evaluations"
    
    evaluation_id = Column(String, primary_key=True)
    company_id = Column(String)
    user_id = Column(String)
    verdict = Column(String)
    overall_score = Column(Float)
    agent_scores = Column(JSON)
    detailed_scores = Column(JSON)
    explanation = Column(Text)
    recommendations = Column(JSON)
    stage_weights = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)
    privacy_mode = Column(Boolean, default=True)

class Investor(Base):
    __tablename__ = "investors"
    
    investor_id = Column(String, primary_key=True)
    name = Column(String)
    type = Column(String)  # vc, angel, corporate, pe
    stages = Column(JSON)
    domains = Column(JSON)
    regions = Column(JSON)
    ticket_size_min = Column(Integer)
    ticket_size_max = Column(Integer)
    portfolio_companies = Column(JSON)
    investment_thesis = Column(Text)
    verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class Match(Base):
    __tablename__ = "matches"
    
    match_id = Column(String, primary_key=True)
    startup_id = Column(String)
    investor_id = Column(String)
    match_score = Column(Float)
    match_reasons = Column(JSON)
    stage_alignment = Column(Float)
    domain_alignment = Column(Float)
    geographic_alignment = Column(Float)
    thesis_alignment = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)

class AuditLog(Base):
    __tablename__ = "audit_logs"
    
    log_id = Column(String, primary_key=True)
    user_id = Column(String)
    action = Column(String)
    resource_type = Column(String)
    resource_id = Column(String)
    metadata = Column(JSON)
    ip_address = Column(String)
    user_agent = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

# Database session dependency
def get_db_session() -> Session:
    """Get database session"""
    db = SessionLocal()
    try:
        return db
    finally:
        db.close()

# Create tables
def create_tables():
    """Create all database tables"""
    Base.metadata.create_all(bind=engine)

if __name__ == "__main__":
    create_tables()
    print("Database tables created successfully")