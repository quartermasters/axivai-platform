#!/usr/bin/env python3
"""
Simple frontend server for AXIVAI
Usage: python3 start_frontend.py
"""

import http.server
import socketserver
import os

class FrontendHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory='frontend/public', **kwargs)
    
    def do_GET(self):
        # Serve index.html for all routes (SPA routing)
        if self.path == '/' or not os.path.exists(os.path.join('frontend/public', self.path.lstrip('/'))):
            self.path = '/index.html'
        return super().do_GET()

def start_frontend_server(port=3000):
    try:
        with socketserver.TCPServer(("", port), FrontendHandler) as httpd:
            print(f"🌐 AXIVAI Frontend running on http://localhost:{port}")
            print("📝 Open in browser: http://localhost:3000")
            print("🔑 Demo credentials: test@example.com / testpassword")
            print("Press Ctrl+C to stop")
            httpd.serve_forever()
    except OSError as e:
        if "Address already in use" in str(e):
            print(f"❌ Port {port} is already in use")
            print(f"🔄 Trying port {port + 1}...")
            start_frontend_server(port + 1)
        else:
            print(f"❌ Error starting server: {e}")

if __name__ == "__main__":
    start_frontend_server()