#!/usr/bin/env python3
"""
AXIVAI Platform - All-in-One Server
Serves both frontend and backend in one process
"""

import http.server
import socketserver
import json
import time
import os
import urllib.parse
from pathlib import Path

class AxivaiServer(http.server.SimpleHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()

    def do_GET(self):
        # API endpoints
        if self.path.startswith('/api/') or self.path == '/health':
            self.handle_api_get()
        else:
            # Frontend files
            self.serve_frontend()

    def do_POST(self):
        if self.path.startswith('/api/'):
            self.handle_api_post()
        else:
            self.send_response(404)
            self.end_headers()

    def handle_api_get(self):
        if self.path == '/health':
            self.send_json({'status': 'healthy', 'service': 'AXIVAI All-in-One'})
        elif self.path == '/api/user/dashboard':
            self.send_json({
                'evaluations_count': 3,
                'recent_evaluations': [
                    {
                        'id': '1',
                        'company_name': 'TechFlow AI',
                        'verdict': 'validate',
                        'score': 0.82,
                        'timestamp': '2025-06-08T10:30:00Z'
                    }
                ],
                'usage_stats': {'reports_this_month': 1, 'tier': 'free'}
            })
        else:
            self.send_response(404)
            self.end_headers()

    def handle_api_post(self):
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length)
        
        try:
            data = json.loads(post_data.decode('utf-8'))
        except:
            self.send_response(400)
            self.end_headers()
            return

        if self.path == '/api/auth/login':
            if data.get('email') == 'test@example.com' and data.get('password') == 'testpassword':
                self.send_json({
                    'access_token': 'demo-token-123',
                    'token_type': 'bearer',
                    'user': {'email': 'test@example.com', 'user_id': 'demo-user'}
                })
            else:
                self.send_json({'error': 'Invalid credentials'}, 401)
                
        elif self.path == '/api/validate/startup':
            # AI Evaluation Logic
            company_name = data.get('company_name', 'Demo Company')
            stage = data.get('stage', 3)
            description = data.get('description', '')
            business_model = data.get('business_model', '')
            
            # Smart scoring based on inputs
            base_score = 0.5
            
            # Length bonus
            if len(description) > 100:
                base_score += 0.15
            elif len(description) > 50:
                base_score += 0.1
            
            # Keyword analysis
            tech_keywords = ['ai', 'ml', 'machine learning', 'artificial intelligence', 'automation', 'saas', 'platform', 'api']
            market_keywords = ['b2b', 'enterprise', 'customers', 'market', 'revenue', 'growth', 'scaling']
            
            tech_score = sum(0.05 for word in tech_keywords if word in description.lower())
            market_score = sum(0.04 for word in market_keywords if word in description.lower())
            
            # Business model bonus
            good_models = ['saas', 'subscription', 'marketplace', 'freemium']
            model_score = 0.1 if any(model in business_model.lower() for model in good_models) else 0
            
            # Stage adjustment
            stage_multiplier = {1: 0.8, 2: 0.9, 3: 1.0, 4: 1.1, 5: 1.0, 6: 0.9, 7: 0.7, 8: 1.2}.get(stage, 1.0)
            
            overall_score = min((base_score + tech_score + market_score + model_score) * stage_multiplier, 1.0)
            
            # Generate agent scores with some variance
            import random
            random.seed(hash(description))  # Consistent scores for same input
            
            agent_scores = {
                'idea_hunter': max(0.1, min(1.0, overall_score + random.uniform(-0.15, 0.15))),
                'market_miner': max(0.1, min(1.0, overall_score + random.uniform(-0.1, 0.1))),
                'model_judge': max(0.1, min(1.0, overall_score + random.uniform(-0.08, 0.12))),
                'risk_oracle': max(0.1, min(1.0, overall_score + random.uniform(-0.2, 0.05))),
                'valuator_x': max(0.1, min(1.0, overall_score + random.uniform(-0.05, 0.2)))
            }
            
            # Determine verdict
            if overall_score >= 0.75:
                verdict = 'validate'
            elif overall_score >= 0.55:
                verdict = 'conditional'
            elif overall_score >= 0.35:
                verdict = 'pivot'
            else:
                verdict = 'invalid'
            
            # Generate recommendations
            recommendations = []
            if tech_score < 0.1:
                recommendations.append('Strengthen technical feasibility analysis')
            if market_score < 0.1:
                recommendations.append('Conduct deeper market research and validation')
            if not business_model:
                recommendations.append('Define clear revenue model and monetization strategy')
            if stage <= 3:
                recommendations.append('Focus on customer validation and early traction')
            else:
                recommendations.append('Optimize growth metrics and scaling strategy')
            
            # Default recommendations if none triggered
            if not recommendations:
                recommendations = [
                    'Build minimum viable product (MVP)',
                    'Validate assumptions with target customers',
                    'Track key performance indicators (KPIs)'
                ]
            
            self.send_json({
                'evaluation_id': f'eval-{int(time.time())}',
                'verdict': verdict,
                'overall_score': round(overall_score, 3),
                'agent_scores': {k: round(v, 3) for k, v in agent_scores.items()},
                'explanation': f'Based on stage {stage} evaluation, {company_name} scored {round(overall_score * 100)}%. ' + 
                              ('Strong potential with good market positioning.' if overall_score >= 0.7 else
                               'Moderate potential, consider addressing key areas.' if overall_score >= 0.5 else
                               'Significant improvements needed for viability.'),
                'recommendations': recommendations[:3],
                'timestamp': time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())
            })
        else:
            self.send_response(404)
            self.end_headers()

    def serve_frontend(self):
        # Serve frontend files
        if self.path == '/' or self.path == '/dashboard' or self.path == '/evaluate':
            self.path = '/simple.html'  # Default to simple.html for compatibility
        
        # Remove leading slash and construct file path
        file_path = Path('frontend/public') / self.path.lstrip('/')
        
        if file_path.exists() and file_path.is_file():
            self.send_response(200)
            
            # Set content type
            if file_path.suffix == '.html':
                self.send_header('Content-Type', 'text/html; charset=utf-8')
            elif file_path.suffix == '.js':
                self.send_header('Content-Type', 'application/javascript; charset=utf-8')
            elif file_path.suffix == '.css':
                self.send_header('Content-Type', 'text/css; charset=utf-8')
            else:
                self.send_header('Content-Type', 'application/octet-stream')
            
            # Add CORS headers
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Cache-Control', 'no-cache')
            self.end_headers()
            
            with open(file_path, 'rb') as f:
                self.wfile.write(f.read())
        else:
            # Fallback to simple.html
            simple_path = Path('frontend/public/simple.html')
            if simple_path.exists():
                self.send_response(200)
                self.send_header('Content-Type', 'text/html; charset=utf-8')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                with open(simple_path, 'rb') as f:
                    self.wfile.write(f.read())
            else:
                self.send_response(404)
                self.send_header('Content-Type', 'text/html')
                self.end_headers()
                self.wfile.write(b'<h1>404 - File not found</h1>')

    def send_json(self, data, status=200):
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode())

def start_server(port=3000):
    try:
        with socketserver.TCPServer(("", port), AxivaiServer) as httpd:
            print("🚀 AXIVAI Platform Started Successfully!")
            print("=" * 50)
            print(f"🌐 Frontend: http://localhost:{port}")
            print(f"🔧 Backend:  http://localhost:{port}/health")
            print("")
            print("🔑 Demo Credentials:")
            print("   Email:    test@example.com")
            print("   Password: testpassword")
            print("")
            print("✨ Features Available:")
            print("   • AI-powered startup evaluation")
            print("   • Stage-aware scoring (1-8 lifecycle)")
            print("   • Real-time verdict classification")
            print("   • Interactive results dashboard")
            print("")
            print("Press Ctrl+C to stop")
            print("=" * 50)
            httpd.serve_forever()
    except OSError as e:
        if "Address already in use" in str(e):
            print(f"❌ Port {port} is already in use")
            print(f"🔄 Trying port {port + 1}...")
            start_server(port + 1)
        else:
            print(f"❌ Error starting server: {e}")

if __name__ == "__main__":
    # Change to script directory
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    start_server()