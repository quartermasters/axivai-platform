#!/usr/bin/env python3
"""
Simple AXIVAI Backend - No dependencies required
Usage: python3 simple_backend.py
"""

from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import urllib.parse
import threading
import time

class AxivaiHandler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()

    def do_GET(self):
        if self.path == '/health':
            self.send_json({'status': 'healthy', 'service': 'AXIVAI Backend'})
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

    def do_POST(self):
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
            # Simulate AI evaluation
            company_name = data.get('company_name', 'Demo Company')
            stage = data.get('stage', 3)
            description = data.get('description', '')
            
            # Simple scoring logic based on description length and keywords
            score = 0.5
            if len(description) > 50:
                score += 0.1
            if any(word in description.lower() for word in ['ai', 'ml', 'saas', 'platform']):
                score += 0.2
            if stage in [3, 4, 5]:  # Growth stages
                score += 0.1
                
            verdict = 'validate' if score >= 0.7 else 'conditional' if score >= 0.5 else 'pivot'
            
            self.send_json({
                'evaluation_id': f'eval-{int(time.time())}',
                'verdict': verdict,
                'overall_score': min(score, 1.0),
                'agent_scores': {
                    'idea_hunter': min(score + 0.1, 1.0),
                    'market_miner': min(score - 0.05, 1.0),
                    'model_judge': min(score + 0.05, 1.0),
                    'risk_oracle': min(score - 0.1, 1.0),
                    'valuator_x': min(score + 0.15, 1.0)
                },
                'explanation': f'Based on stage {stage} evaluation, {company_name} shows {"strong" if score >= 0.7 else "moderate"} potential.',
                'recommendations': [
                    'Validate core assumptions with customers',
                    'Build minimum viable product (MVP)',
                    'Focus on customer acquisition strategy',
                    'Track key performance metrics',
                    'Consider market expansion opportunities'
                ][:3],
                'timestamp': time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())
            })
        else:
            self.send_response(404)
            self.end_headers()

    def send_json(self, data, status=200):
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode())

def start_server(port=8000):
    try:
        server = HTTPServer(('localhost', port), AxivaiHandler)
        print(f"🚀 AXIVAI Backend running on http://localhost:{port}")
        print(f"📊 Health check: http://localhost:{port}/health")
        print("Press Ctrl+C to stop")
        server.serve_forever()
    except OSError as e:
        if "Address already in use" in str(e):
            print(f"❌ Port {port} is already in use")
            print(f"🔄 Trying port {port + 1}...")
            start_server(port + 1)
        else:
            print(f"❌ Error starting server: {e}")

if __name__ == "__main__":
    start_server()