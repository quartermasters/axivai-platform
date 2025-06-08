#!/usr/bin/env python3
"""
Simple AXIVAI platform runner without Docker
Run with: python3 run_simple.py
"""

try:
    from http.server import HTTPServer, SimpleHTTPRequestHandler
    import json
    import os
    import subprocess
    import threading
    import time
    from urllib.parse import parse_qs, urlparse
    
    class APIHandler(SimpleHTTPRequestHandler):
        def do_POST(self):
            if self.path == '/api/auth/login':
                content_length = int(self.headers.get('Content-Length', 0))
                post_data = self.rfile.read(content_length)
                
                try:
                    data = json.loads(post_data.decode('utf-8'))
                    if data.get('email') == 'test@example.com' and data.get('password') == 'testpassword':
                        response = {
                            "access_token": "demo-token-123",
                            "token_type": "bearer",
                            "user": {"email": "test@example.com", "user_id": "demo-user"}
                        }
                    else:
                        response = {"error": "Invalid credentials"}
                    
                    self.send_response(200)
                    self.send_header('Content-Type', 'application/json')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()
                    self.wfile.write(json.dumps(response).encode())
                except:
                    self.send_response(400)
                    self.end_headers()
            else:
                self.send_response(404)
                self.end_headers()
        
        def do_GET(self):
            if self.path == '/health':
                response = {"status": "healthy", "service": "AXIVAI Simple Backend"}
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps(response).encode())
            elif self.path == '/api/user/dashboard':
                response = {
                    "evaluations_count": 3,
                    "recent_evaluations": [
                        {"id": "1", "company_name": "Demo Startup", "verdict": "validate", "score": 0.78, "timestamp": "2025-06-08T10:30:00Z"}
                    ],
                    "usage_stats": {"reports_this_month": 1, "tier": "free"}
                }
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps(response).encode())
            elif self.path.startswith('/api/validate/startup'):
                response = {
                    "evaluation_id": "demo-eval-123",
                    "verdict": "validate",
                    "overall_score": 0.78,
                    "agent_scores": {"idea_hunter": 0.85, "market_miner": 0.72},
                    "explanation": "Strong startup with good potential.",
                    "recommendations": ["Build MVP", "Validate market"],
                    "timestamp": "2025-06-08T10:30:00Z"
                }
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps(response).encode())
            else:
                self.send_response(404)
                self.end_headers()
        
        def do_OPTIONS(self):
            self.send_response(200)
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
            self.end_headers()

    def start_backend():
        print("🔧 Starting AXIVAI Backend on http://localhost:8000")
        server = HTTPServer(('localhost', 8000), APIHandler)
        server.serve_forever()

    def start_frontend():
        print("🌐 Starting AXIVAI Frontend on http://localhost:3000")
        os.chdir('frontend')
        
        # Simple static server for frontend
        try:
            import http.server
            import socketserver
            
            class FrontendHandler(http.server.SimpleHTTPRequestHandler):
                def __init__(self, *args, **kwargs):
                    super().__init__(*args, directory='public', **kwargs)
                
                def do_GET(self):
                    # Serve index.html for all routes (SPA routing)
                    if not os.path.exists(self.path.lstrip('/')):
                        self.path = '/index.html'
                    return super().do_GET()
            
            with socketserver.TCPServer(("", 3000), FrontendHandler) as httpd:
                httpd.serve_forever()
        except:
            print("❌ Could not start frontend server")

    if __name__ == "__main__":
        print("🚀 Starting AXIVAI Platform (Simple Mode)")
        print("=" * 50)
        
        # Start backend in a thread
        backend_thread = threading.Thread(target=start_backend, daemon=True)
        backend_thread.start()
        
        time.sleep(2)
        print("✅ Backend running at: http://localhost:8000")
        print("📊 Health check: http://localhost:8000/health")
        print()
        print("🔑 Demo credentials:")
        print("   Email: test@example.com")
        print("   Password: testpassword")
        print()
        print("Press Ctrl+C to stop")
        
        try:
            # Keep main thread alive
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            print("\n🛑 Stopping AXIVAI Platform")

except ImportError as e:
    print(f"❌ Missing dependency: {e}")
    print("Please install Python 3 and try again")
except Exception as e:
    print(f"❌ Error: {e}")
    print("Please check your Python installation")