# Contributing to AXIVAI Platform

We love your input! We want to make contributing to AXIVAI as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## Development Process

We use GitHub to host code, to track issues and feature requests, as well as accept pull requests.

### Pull Requests Process

1. Fork the repo and create your branch from `main`.
2. If you've added code that should be tested, add tests.
3. If you've changed APIs, update the documentation.
4. Ensure the test suite passes.
5. Make sure your code lints.
6. Issue that pull request!

### Development Setup

```bash
# Clone your fork
git clone https://github.com/yourusername/axivai-platform.git
cd axivai-platform

# Install dependencies
pip install -r backend/requirements.txt
cd frontend && npm install

# Set up environment
cp .env.example .env
# Edit .env with your configuration

# Run tests
pytest backend/tests/
npm test --prefix frontend
```

## Code Style

### Python (Backend)
- Follow PEP 8
- Use type hints
- Maximum line length: 88 characters
- Use Black for formatting: `black backend/`
- Use isort for imports: `isort backend/`

### JavaScript/TypeScript (Frontend)
- Use ESLint configuration provided
- Prefer functional components with hooks
- Use TypeScript for type safety
- Maximum line length: 100 characters

### Commit Messages
- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line

Example:
```
Add investor matching algorithm

- Implement compatibility scoring
- Add portfolio analysis
- Update API endpoints

Fixes #123
```

## Testing

### Backend Tests
```bash
# Unit tests
pytest backend/tests/unit/

# Integration tests  
pytest backend/tests/integration/

# Coverage
pytest --cov=backend/ backend/tests/
```

### Frontend Tests
```bash
# Unit tests
npm test --prefix frontend

# E2E tests
npm run test:e2e --prefix frontend
```

## Bug Reports

We use GitHub issues to track public bugs. Report a bug by opening a new issue.

**Great Bug Reports** tend to have:

- A quick summary and/or background
- Steps to reproduce
  - Be specific!
  - Give sample code if you can
- What you expected would happen
- What actually happens
- Notes (possibly including why you think this might be happening, or stuff you tried that didn't work)

## Feature Requests

We welcome feature requests! Please:

1. Check if the feature already exists or has been requested
2. Clearly describe the feature and its benefits
3. Consider the scope and complexity
4. Provide examples or mockups if helpful

## AI Agent Development

When contributing to the AI agent system:

### IdeaHunter Agent
- Focus on innovation and feasibility detection
- Use LLM prompts for originality assessment
- Include confidence scoring

### MarketMiner Agent  
- Integrate with external market data APIs
- Implement TAM/SAM/SOM calculations
- Add competitive landscape analysis

### ModelJudge Agent
- Evaluate business model viability
- Score revenue model sustainability
- Assess scalability potential

### RiskOracle Agent
- Identify red flags and risk factors
- Implement failure prediction models
- Add regulatory compliance checks

### ValuatorX Agent
- Estimate valuation bands
- Compare with market multiples
- Analyze funding efficiency

## Documentation

- Update README.md for significant changes
- Add docstrings to all functions and classes
- Update API documentation for endpoint changes
- Include examples in documentation

## Community Guidelines

### Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what is best for the community
- Show empathy towards other community members

### Getting Help

- Join our Discord community
- Check existing issues and discussions
- Ask questions in pull request reviews
- Reach out to maintainers for guidance

## Recognition

Contributors will be recognized in:

- README.md acknowledgments
- Release notes for significant contributions
- Annual contributor highlights
- Special badges for top contributors

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Release Process

1. Version bump in package.json and pyproject.toml
2. Update CHANGELOG.md
3. Create release branch
4. Tag release: `git tag v1.x.x`
5. Create GitHub release with notes
6. Deploy to staging and production

## Questions?

Don't hesitate to reach out:

- Open an issue
- Join our Discord
- Email: contribute@axivai.com

Thank you for contributing to AXIVAI! 🚀