"""Status server on the ComfyUI port while the Pod prepares; stopped right before ComfyUI starts."""
import threading
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

STATUS_PAGE = Path(__file__).resolve().parent.parent / "status" / "index.html"


def start(state, port):
    page = STATUS_PAGE.read_bytes()

    class Handler(BaseHTTPRequestHandler):
        def _send(self, body, content_type):
            self.send_response(200)
            self.send_header("Content-Type", content_type)
            self.send_header("Content-Length", str(len(body)))
            self.send_header("Cache-Control", "no-store")
            self.end_headers()
            if self.command != "HEAD":
                self.wfile.write(body)

        def do_GET(self):
            if self.path.split("?")[0] == "/status.json":
                self._send(state.to_json().encode("utf-8"), "application/json; charset=utf-8")
            else:
                # Any other path (including ComfyUI's own) shows the status page until ComfyUI is up.
                self._send(page, "text/html; charset=utf-8")

        do_HEAD = do_GET

        def log_message(self, *args):
            pass

    server = ThreadingHTTPServer(("0.0.0.0", port), Handler)
    server.daemon_threads = True
    threading.Thread(target=server.serve_forever, daemon=True).start()
    return server


def stop(server):
    server.shutdown()
    server.server_close()
