import os
import sys
import time
import subprocess
import http.server
import socketserver
import threading

PORT = 5174
DIRECTORY = os.path.join(os.path.dirname(__file__), 'client', 'dist')
CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), 'screenshots')
os.makedirs(OUTPUT_DIR, exist_ok=True)

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)
    def log_message(self, format, *args):
        pass # suppress server logs

def start_server():
    socketserver.TCPServer.allow_reuse_address = True
    httpd = socketserver.TCPServer(("", PORT), Handler)
    return httpd

def capture():
    httpd = start_server()
    thread = threading.Thread(target=httpd.serve_forever)
    thread.daemon = True
    thread.start()
    print(f"Static preview server running on port {PORT}")
    time.sleep(1)

    pages = [
        ("landing.png", f"http://localhost:{PORT}"),
        ("dashboard.png", f"http://localhost:{PORT}/?page=dashboard"),
        ("skills.png", f"http://localhost:{PORT}/?page=skills"),
        ("goals.png", f"http://localhost:{PORT}/?page=goals"),
        ("analytics.png", f"http://localhost:{PORT}/?page=analytics"),
        ("portfolio.png", f"http://localhost:{PORT}/?view=portfolio")
    ]

    for name, url in pages:
        out_path = os.path.join(OUTPUT_DIR, name)
        print(f"Capturing {name} from {url}...")
        cmd = [
            CHROME_PATH,
            "--headless=new",
            "--disable-gpu",
            "--no-sandbox",
            "--hide-scrollbars",
            "--window-size=1280,800",
            f"--screenshot={out_path}",
            url
        ]
        res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        if os.path.exists(out_path):
            size_kb = os.path.getsize(out_path) / 1024
            print(f"✓ Saved {name} ({size_kb:.1f} KB)")
        else:
            print(f"✗ Failed to capture {name}: {res.stderr.decode('utf-8', errors='ignore')}")

    httpd.shutdown()
    print("Done capturing screenshots!")

if __name__ == '__main__':
    capture()
