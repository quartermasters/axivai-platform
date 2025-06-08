# AXIVAI Platform Deployment Guide

## Quick Start

### Prerequisites
- Docker and Docker Compose
- Git
- OpenAI API key (required for AI agents)

### Local Development Setup

1. **Clone and Setup**
   ```bash
   cd axivai-platform
   chmod +x scripts/start.sh
   ./scripts/start.sh
   ```

2. **Configure Environment**
   - Update `.env` file with your API keys
   - Ensure `OPENAI_API_KEY` is set for AI agents

3. **Access Platform**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

### Demo Credentials
- Email: `test@example.com`
- Password: `testpassword`

## Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React UI      │────│   FastAPI       │────│   PostgreSQL    │
│   (Port 3000)   │    │   (Port 8000)   │    │   (Port 5432)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                       ┌─────────────────┐    ┌─────────────────┐
                       │   Celery        │────│   Redis         │
                       │   Workers       │    │   (Port 6379)   │
                       └─────────────────┘    └─────────────────┘
```

## Core Components

### Backend (`/backend`)
- **FastAPI** - REST API and WebSocket endpoints
- **SQLAlchemy** - Database ORM with PostgreSQL
- **Celery** - Async task queue for AI agent orchestration
- **JWT** - Authentication and authorization
- **Pydantic** - Data validation and serialization

### Frontend (`/frontend`)
- **React 18** - Modern UI framework
- **Material-UI** - Component library
- **TypeScript** - Type safety
- **Recharts** - Data visualization
- **React Router** - Client-side routing

### AI Agents (`/backend/agents`)
- **IdeaHunter** - LLM-driven feasibility analysis
- **MarketMiner** - TAM/SAM/SOM market research
- **ModelJudge** - Business model viability scoring
- **RiskOracle** - Risk assessment and red flag detection
- **ValuatorX** - Valuation band estimation

### Database Schema
- **Users** - Authentication and profile data
- **Companies** - Startup information and submissions
- **Evaluations** - AI analysis results and verdicts
- **Investors** - Investor profiles for matching
- **Matches** - Startup-investor compatibility scores
- **AuditLogs** - Security and compliance tracking

## Key Features Implemented

### ✅ Core Evaluation Pipeline
- Stage-aware weighting (1-8 lifecycle stages)
- Hybrid AI agents with confidence scoring
- Verdict classification (Validate/Conditional/Pivot/Invalid)
- Explainable AI with reasoning trails

### ✅ Security & Privacy
- Zero-retention mode (24-hour data deletion)
- GDPR/CCPA compliant data controls
- JWT-based authentication
- File upload validation and scanning

### ✅ User Experience
- Multi-step evaluation form
- Interactive results visualization
- Privacy control center
- Responsive Material-UI design

### ✅ Investor Matching
- Profile-based compatibility scoring
- Stage and domain alignment
- Bookmarking and interaction tracking
- Real-time match recommendations

## Production Deployment

### Environment Variables
```bash
# Required
DATABASE_URL=postgresql://user:pass@host:5432/axivai
OPENAI_API_KEY=your-openai-key
SECRET_KEY=secure-random-key

# Optional
ANTHROPIC_API_KEY=your-anthropic-key
REDIS_URL=redis://host:6379/0
ENVIRONMENT=production
```

### Docker Production Build
```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Deploy with scaling
docker-compose -f docker-compose.prod.yml up -d --scale celery-worker=3
```

### Cloud Deployment Options

#### AWS ECS/Fargate
- Use provided Dockerfiles
- Set up RDS PostgreSQL and ElastiCache Redis
- Configure Application Load Balancer
- Set environment variables in task definitions

#### Google Cloud Run
- Deploy backend and frontend as separate services
- Use Cloud SQL for PostgreSQL
- Use Memorystore for Redis
- Configure Cloud Storage for file uploads

#### Azure Container Instances
- Deploy using Azure Container Registry
- Use Azure Database for PostgreSQL
- Use Azure Cache for Redis
- Set up Azure Application Gateway

## Monitoring & Observability

### Health Checks
- `/health` - API health status
- Database connection monitoring
- Redis connectivity checks
- AI service availability

### Logging
- Structured JSON logs
- Request/response tracking
- Error monitoring with stack traces
- Performance metrics

### Security Monitoring
- Failed authentication attempts
- Suspicious upload patterns
- Rate limiting violations
- Data access audit trails

## Scaling Considerations

### Horizontal Scaling
- **API**: Stateless FastAPI instances behind load balancer
- **Workers**: Multiple Celery workers for AI processing
- **Database**: PostgreSQL read replicas for analytics
- **Cache**: Redis Cluster for high availability

### Performance Optimization
- **Database**: Connection pooling, query optimization
- **AI Agents**: Async processing, result caching
- **Frontend**: Code splitting, lazy loading
- **CDN**: Static asset delivery optimization

## Compliance & Governance

### Data Protection
- GDPR Article 17 (Right to erasure)
- CCPA consumer rights implementation
- DIFC Data Protection Law compliance
- SOC 2 Type II audit trail

### AI Governance
- EU AI Act compliance monitoring
- Bias testing with synthetic datasets
- Model explainability requirements
- Human oversight mechanisms

## Support & Maintenance

### Regular Tasks
- Database backup and rotation
- Security patch updates
- AI model performance monitoring
- User feedback analysis

### Troubleshooting
```bash
# View logs
docker-compose logs -f backend
docker-compose logs -f celery-worker

# Database access
docker-compose exec postgres psql -U axivai_user -d axivai

# Redis monitoring
docker-compose exec redis redis-cli monitor
```

### Performance Tuning
- Monitor API response times
- Track AI agent processing duration
- Optimize database queries
- Cache frequently accessed data

---

For technical support or deployment assistance, contact the development team or refer to the project documentation.