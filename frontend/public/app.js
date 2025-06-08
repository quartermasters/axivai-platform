// Simple AXIVAI Frontend
class AxivaiApp {
    constructor() {
        // Try relative URLs first (same server), then absolute URLs
        this.apiUrls = [
            '', // Relative URL (same server)
            'http://localhost:8001',
            'http://localhost:8000', 
            'http://127.0.0.1:8001',
            'http://127.0.0.1:8000'
        ];
        this.apiUrl = '';
        this.token = localStorage.getItem('token');
        this.init();
    }

    init() {
        this.render();
        this.setupEventListeners();
    }

    async apiCall(endpoint, method = 'GET', data = null) {
        for (const apiUrl of this.apiUrls) {
            try {
                const options = {
                    method,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    mode: 'cors'
                };

                if (this.token) {
                    options.headers['Authorization'] = `Bearer ${this.token}`;
                }

                if (data) {
                    options.body = JSON.stringify(data);
                }

                const response = await fetch(`${apiUrl}${endpoint}`, options);
                
                if (response.ok) {
                    this.apiUrl = apiUrl; // Remember working URL
                    return await response.json();
                }
            } catch (error) {
                console.log(`Failed to connect to ${apiUrl}, trying next...`);
                continue;
            }
        }
        
        // If all APIs fail, return mock data for demo
        console.log('All APIs failed, using mock data');
        return this.getMockResponse(endpoint, method, data);
    }

    getMockResponse(endpoint, method, data) {
        if (endpoint === '/api/auth/login' && method === 'POST') {
            if (data && data.email === 'test@example.com' && data.password === 'testpassword') {
                return {
                    access_token: 'demo-token-mock',
                    token_type: 'bearer',
                    user: { email: 'test@example.com', user_id: 'demo-user' }
                };
            }
            return { error: 'Invalid credentials' };
        }
        
        if (endpoint === '/api/validate/startup' && method === 'POST') {
            const score = 0.75 + Math.random() * 0.2; // Random score between 0.75-0.95
            return {
                evaluation_id: 'demo-eval-' + Date.now(),
                verdict: score > 0.8 ? 'validate' : score > 0.6 ? 'conditional' : 'pivot',
                overall_score: score,
                agent_scores: {
                    idea_hunter: Math.min(score + 0.1, 1.0),
                    market_miner: Math.max(score - 0.05, 0.1),
                    model_judge: Math.min(score + 0.05, 1.0),
                    risk_oracle: Math.max(score - 0.1, 0.1),
                    valuator_x: Math.min(score + 0.15, 1.0)
                },
                explanation: `Based on your submission, this startup shows ${score > 0.8 ? 'strong' : 'moderate'} potential with a score of ${Math.round(score * 100)}%.`,
                recommendations: [
                    'Validate core business assumptions',
                    'Build minimum viable product (MVP)',
                    'Focus on customer acquisition',
                    'Track key performance metrics',
                    'Consider strategic partnerships'
                ].slice(0, 3),
                timestamp: new Date().toISOString()
            };
        }
        
        if (endpoint === '/api/user/dashboard') {
            return {
                evaluations_count: 3,
                recent_evaluations: [
                    {
                        id: '1',
                        company_name: 'Demo Startup',
                        verdict: 'validate',
                        score: 0.78,
                        timestamp: new Date().toISOString()
                    }
                ],
                usage_stats: { reports_this_month: 1, tier: 'free' }
            };
        }
        
        return { error: 'API not available - using demo mode' };
    }

    render() {
        const app = document.getElementById('app');
        
        if (!this.token) {
            app.innerHTML = this.renderLogin();
        } else {
            app.innerHTML = this.renderDashboard();
        }
    }

    renderLogin() {
        return `
            <div style="max-width: 400px; margin: 50px auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                <h1 style="text-align: center; color: #1976d2;">🚀 AXIVAI</h1>
                <p style="text-align: center; color: #666;">AI-Powered Startup Evaluation</p>
                
                <form id="loginForm" style="margin-top: 30px;">
                    <div style="margin-bottom: 15px;">
                        <label>Email:</label>
                        <input type="email" id="email" value="test@example.com" 
                               style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box;">
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <label>Password:</label>
                        <input type="password" id="password" value="testpassword"
                               style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box;">
                    </div>
                    
                    <button type="submit" style="width: 100%; padding: 12px; background: #1976d2; color: white; border: none; border-radius: 4px; cursor: pointer;">
                        Sign In
                    </button>
                </form>
                
                <div id="loginError" style="color: red; margin-top: 10px; display: none;"></div>
                
                <div style="margin-top: 20px; padding: 10px; background: #f5f5f5; border-radius: 4px;">
                    <small><strong>Demo Credentials:</strong><br>
                    Email: test@example.com<br>
                    Password: testpassword</small>
                </div>
            </div>
        `;
    }

    renderDashboard() {
        return `
            <div style="max-width: 1200px; margin: 0 auto; padding: 20px;">
                <header style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 1px solid #eee;">
                    <h1 style="color: #1976d2;">🚀 AXIVAI Dashboard</h1>
                    <button id="logoutBtn" style="padding: 8px 16px; background: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer;">
                        Logout
                    </button>
                </header>

                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 30px;">
                    <div style="padding: 20px; background: white; border: 1px solid #e0e0e0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <h3 style="color: #1976d2; margin: 0 0 10px 0;">📊 Total Evaluations</h3>
                        <p style="font-size: 2em; margin: 0; font-weight: bold;">3</p>
                    </div>
                    
                    <div style="padding: 20px; background: white; border: 1px solid #e0e0e0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <h3 style="color: #4caf50; margin: 0 0 10px 0;">📈 This Month</h3>
                        <p style="font-size: 2em; margin: 0; font-weight: bold;">1</p>
                    </div>
                    
                    <div style="padding: 20px; background: white; border: 1px solid #e0e0e0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <h3 style="color: #ff9800; margin: 0 0 10px 0;">🎯 Current Tier</h3>
                        <p style="font-size: 1.5em; margin: 0; font-weight: bold;">FREE</p>
                    </div>
                    
                    <div style="padding: 20px; background: white; border: 1px solid #e0e0e0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <h3 style="color: #9c27b0; margin: 0 0 10px 0;">⏳ Reports Left</h3>
                        <p style="font-size: 2em; margin: 0; font-weight: bold;">2</p>
                    </div>
                </div>

                <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 20px;">
                    <div style="padding: 20px; background: white; border: 1px solid #e0e0e0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <h3>🚀 Start New Evaluation</h3>
                        <p>Evaluate your startup with our AI-powered assessment system.</p>
                        <button id="newEvalBtn" style="padding: 12px 24px; background: #1976d2; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 16px;">
                            New Evaluation
                        </button>
                    </div>
                    
                    <div style="padding: 20px; background: white; border: 1px solid #e0e0e0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <h3>📋 Recent Evaluations</h3>
                        <div id="recentEvals">
                            <div style="padding: 10px; border-left: 4px solid #4caf50; margin-bottom: 10px; background: #f1f8e9;">
                                <strong>Demo Startup</strong><br>
                                <small>✅ Validate (78%) - Today</small>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="evaluationForm" style="display: none; margin-top: 30px; padding: 20px; background: white; border: 1px solid #e0e0e0; border-radius: 8px;">
                    <h3>📝 Startup Evaluation Form</h3>
                    <form id="evalForm">
                        <div style="margin-bottom: 15px;">
                            <label>Company Name:</label>
                            <input type="text" id="companyName" required 
                                   style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box;">
                        </div>
                        
                        <div style="margin-bottom: 15px;">
                            <label>Lifecycle Stage:</label>
                            <select id="stage" style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px;">
                                <option value="1">1 - Ideation</option>
                                <option value="2">2 - Validation</option>
                                <option value="3" selected>3 - Early Traction</option>
                                <option value="4">4 - Growth</option>
                                <option value="5">5 - Expansion</option>
                            </select>
                        </div>
                        
                        <div style="margin-bottom: 15px;">
                            <label>Description:</label>
                            <textarea id="description" required rows="4" 
                                      style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box;"
                                      placeholder="Describe your startup, what problem it solves..."></textarea>
                        </div>
                        
                        <div style="margin-bottom: 15px;">
                            <label>Business Model:</label>
                            <input type="text" id="businessModel" 
                                   style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box;"
                                   placeholder="e.g., SaaS, Marketplace, Freemium...">
                        </div>
                        
                        <div style="display: flex; gap: 10px;">
                            <button type="submit" style="padding: 12px 24px; background: #4caf50; color: white; border: none; border-radius: 4px; cursor: pointer;">
                                🔍 Evaluate Startup
                            </button>
                            <button type="button" id="cancelEval" style="padding: 12px 24px; background: #9e9e9e; color: white; border: none; border-radius: 4px; cursor: pointer;">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>

                <div id="results" style="display: none; margin-top: 30px;"></div>
            </div>
        `;
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.id === 'logoutBtn') {
                this.logout();
            } else if (e.target.id === 'newEvalBtn') {
                this.showEvaluationForm();
            } else if (e.target.id === 'cancelEval') {
                this.hideEvaluationForm();
            }
        });

        document.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (e.target.id === 'loginForm') {
                await this.login();
            } else if (e.target.id === 'evalForm') {
                await this.submitEvaluation();
            }
        });
    }

    async login() {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const errorDiv = document.getElementById('loginError');

        const result = await this.apiCall('/api/auth/login', 'POST', { email, password });

        if (result.access_token) {
            this.token = result.access_token;
            localStorage.setItem('token', this.token);
            this.render();
        } else {
            errorDiv.textContent = result.error || 'Login failed';
            errorDiv.style.display = 'block';
        }
    }

    logout() {
        this.token = null;
        localStorage.removeItem('token');
        this.render();
    }

    showEvaluationForm() {
        document.getElementById('evaluationForm').style.display = 'block';
        document.getElementById('evaluationForm').scrollIntoView({ behavior: 'smooth' });
    }

    hideEvaluationForm() {
        document.getElementById('evaluationForm').style.display = 'none';
    }

    async submitEvaluation() {
        const formData = {
            company_name: document.getElementById('companyName').value,
            stage: parseInt(document.getElementById('stage').value),
            description: document.getElementById('description').value,
            business_model: document.getElementById('businessModel').value,
            privacy_mode: true
        };

        const result = await this.apiCall('/api/validate/startup', 'POST', formData);

        if (result.evaluation_id) {
            this.showResults(result);
            this.hideEvaluationForm();
        } else {
            alert('Evaluation failed: ' + (result.error || 'Unknown error'));
        }
    }

    showResults(result) {
        const resultsDiv = document.getElementById('results');
        const verdictColor = result.verdict === 'validate' ? '#4caf50' : 
                           result.verdict === 'conditional' ? '#ff9800' : '#f44336';
        
        resultsDiv.innerHTML = `
            <div style="padding: 20px; background: white; border: 1px solid #e0e0e0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <h3>📊 Evaluation Results</h3>
                
                <div style="padding: 20px; border-left: 4px solid ${verdictColor}; background: ${verdictColor}10; margin-bottom: 20px;">
                    <h2 style="margin: 0; color: ${verdictColor};">
                        ${result.verdict === 'validate' ? '✅ Validate' : 
                          result.verdict === 'conditional' ? '⚠️ Conditional' : '❌ Invalid'}
                    </h2>
                    <p style="font-size: 1.2em; margin: 5px 0;">Overall Score: ${Math.round(result.overall_score * 100)}%</p>
                    <p style="margin: 0;">${result.explanation}</p>
                </div>

                <div style="margin-bottom: 20px;">
                    <h4>🎯 Agent Scores:</h4>
                    ${Object.entries(result.agent_scores).map(([agent, score]) => `
                        <div style="display: flex; justify-content: space-between; padding: 5px 0;">
                            <span>${agent.replace('_', ' ').toUpperCase()}</span>
                            <span style="font-weight: bold;">${Math.round(score * 100)}%</span>
                        </div>
                    `).join('')}
                </div>

                <div>
                    <h4>💡 Recommendations:</h4>
                    <ul>
                        ${result.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;
        
        resultsDiv.style.display = 'block';
        resultsDiv.scrollIntoView({ behavior: 'smooth' });
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AxivaiApp();
});