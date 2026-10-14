"""Tests for bootstrap.models._resolve_download_url: the token goes to the download URL only, never
to the host a redirect points at. A local HTTP server stands in for Hugging Face / Civitai."""

import http.server
import sys
import threading
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "image"))

from bootstrap.models import AuthError, _resolve_download_url  # noqa: E402

SEEN = []


class Handler(http.server.BaseHTTPRequestHandler):
    def do_GET(self):  # noqa: N802 - http.server API
        SEEN.append((self.path, self.headers.get("Authorization")))
        if self.path == "/redirect":
            self.send_response(302)
            self.send_header("Location", "/signed/file.safetensors?sig=abc")
            self.end_headers()
        elif self.path == "/gated":
            self.send_response(401)
            self.end_headers()
        elif self.path == "/missing":
            self.send_response(404)
            self.end_headers()
        else:
            self.send_response(200)
            self.send_header("Content-Length", "4")
            self.end_headers()
            self.wfile.write(b"data")

    def log_message(self, *args):
        pass


class ResolveDownloadUrlTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.server = http.server.ThreadingHTTPServer(("127.0.0.1", 0), Handler)
        cls.base = f"http://127.0.0.1:{cls.server.server_address[1]}"
        threading.Thread(target=cls.server.serve_forever, daemon=True).start()

    @classmethod
    def tearDownClass(cls):
        cls.server.shutdown()

    def setUp(self):
        SEEN.clear()

    def test_redirect_returns_signed_url_without_token(self):
        url, token = _resolve_download_url(f"{self.base}/redirect", "secret")
        self.assertEqual(url, f"{self.base}/signed/file.safetensors?sig=abc")
        self.assertIsNone(token)
        # Only the first request was made, with the token; the signed URL was not fetched here.
        self.assertEqual(SEEN, [("/redirect", "Bearer secret")])

    def test_direct_response_keeps_the_token(self):
        url, token = _resolve_download_url(f"{self.base}/plain", "secret")
        self.assertEqual((url, token), (f"{self.base}/plain", "secret"))

    def test_refused_token_is_an_auth_error(self):
        with self.assertRaises(AuthError):
            _resolve_download_url(f"{self.base}/gated", "secret")

    def test_other_errors_are_retryable_runtime_errors(self):
        with self.assertRaises(RuntimeError) as caught:
            _resolve_download_url(f"{self.base}/missing", "secret")
        self.assertNotIn("secret", str(caught.exception))

    def test_without_token_nothing_is_requested(self):
        self.assertEqual(_resolve_download_url(f"{self.base}/redirect", None), (f"{self.base}/redirect", None))
        self.assertEqual(SEEN, [])


if __name__ == "__main__":
    unittest.main()
