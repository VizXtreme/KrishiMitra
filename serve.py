#!/usr/bin/env python3
"""
serve.py - Local Development Web Server for AgriSmart App
Runs a lightweight HTTP server with proper MIME types for ES Modules and opens in browser.
"""

import http.server
import socketserver
import webbrowser
import os
import sys

PORT = 8080
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        # Enable CORS and caching headers for smooth dev experience
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

    def guess_type(self, path):
        # Ensure JavaScript modules have proper application/javascript MIME type
        if path.endswith('.js'):
            return 'application/javascript'
        if path.endswith('.mjs'):
            return 'application/javascript'
        if path.endswith('.css'):
            return 'text/css'
        if path.endswith('.html'):
            return 'text/html'
        if path.endswith('.json'):
            return 'application/json'
        return super().guess_type(path)

def run():
    os.chdir(DIRECTORY)
    # Allow port reuse to prevent WinError 10048
    socketserver.TCPServer.allow_reuse_address = True
    
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        url = f"http://localhost:{PORT}"
        print(f"================================================================")
        print(f" AgriSmart Agricultural Platform Server running!")
        print(f" Serving directory: {DIRECTORY}")
        print(f" Access URL: {url}")
        print(f" Press Ctrl+C to stop the server.")
        print(f"================================================================")
        
        # Check command line arguments for --no-browser
        if "--no-browser" not in sys.argv:
            try:
                webbrowser.open(url)
            except Exception as e:
                print(f"Note: Could not automatically open browser: {e}")
                
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server gracefully...")
            httpd.shutdown()

if __name__ == "__main__":
    run()
