#!/usr/bin/env python3
"""
สมุดบันทึกอารมณ์ (Wheel of Emotions Diary) - local server
รันด้วย: python3 server.py
แล้วเปิดเบราว์เซอร์ที่ http://localhost:8000

ไม่ต้องติดตั้งอะไรเพิ่ม ใช้แต่ Python standard library
บันทึกทุกรายการเป็นไฟล์ .json แยกไฟล์ในโฟลเดอร์ data/entries/
"""
import json
import os
import re
import uuid
from datetime import datetime
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlparse

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
STATIC_DIR = os.path.join(BASE_DIR, "static")
DATA_DIR = os.path.join(BASE_DIR, "data", "entries")
PORT = 8000

os.makedirs(DATA_DIR, exist_ok=True)

STATIC_FILES = {
    "/": ("index.html", "text/html; charset=utf-8"),
    "/index.html": ("index.html", "text/html; charset=utf-8"),
    "/style.css": ("style.css", "text/css; charset=utf-8"),
    "/app.js": ("app.js", "application/javascript; charset=utf-8"),
}

ID_RE = re.compile(r"^[a-zA-Z0-9_\-]+$")


def list_entries():
    entries = []
    if not os.path.isdir(DATA_DIR):
        return entries
    for fname in os.listdir(DATA_DIR):
        if not fname.endswith(".json"):
            continue
        fpath = os.path.join(DATA_DIR, fname)
        try:
            with open(fpath, "r", encoding="utf-8") as f:
                entries.append(json.load(f))
        except (json.JSONDecodeError, OSError):
            continue
    entries.sort(key=lambda e: e.get("createdAt", ""), reverse=True)
    return entries


class Handler(BaseHTTPRequestHandler):
    server_version = "EmotionDiary/1.0"

    def log_message(self, fmt, *args):
        print("[%s] %s" % (self.log_date_time_string(), fmt % args))

    def _send_json(self, status, payload):
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _send_file(self, filename, content_type):
        path = os.path.join(STATIC_DIR, filename)
        try:
            with open(path, "rb") as f:
                body = f.read()
        except OSError:
            self._send_json(404, {"error": "not found"})
            return
        self.send_response(200)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path

        if path in STATIC_FILES:
            fname, ctype = STATIC_FILES[path]
            self._send_file(fname, ctype)
            return

        if path == "/api/entries":
            self._send_json(200, {"entries": list_entries()})
            return

        self._send_json(404, {"error": "not found"})

    def do_POST(self):
        parsed = urlparse(self.path)
        if parsed.path != "/api/entries":
            self._send_json(404, {"error": "not found"})
            return

        length = int(self.headers.get("Content-Length", 0))
        raw = self.rfile.read(length) if length else b"{}"
        try:
            data = json.loads(raw.decode("utf-8"))
        except json.JSONDecodeError:
            self._send_json(400, {"error": "invalid json"})
            return

        text = (data.get("text") or "").strip()
        core = (data.get("core") or "").strip()
        if not core:
            self._send_json(400, {"error": "ต้องเลือกอารมณ์หลักอย่างน้อย 1 อย่าง"})
            return

        now = datetime.now()
        entry_id = now.strftime("%Y%m%d-%H%M%S-") + uuid.uuid4().hex[:6]

        entry = {
            "id": entry_id,
            "date": data.get("date") or now.strftime("%Y-%m-%d"),
            "time": data.get("time") or now.strftime("%H:%M"),
            "createdAt": now.isoformat(timespec="seconds"),
            "core": core,
            "level2": data.get("level2") or None,
            "level3": data.get("level3") or None,
            "unsure": bool(data.get("unsure")),
            "unsureAt": data.get("unsureAt") or None,  # 'core' | 'level2' | None
            "text": text,
        }

        fpath = os.path.join(DATA_DIR, entry_id + ".json")
        with open(fpath, "w", encoding="utf-8") as f:
            json.dump(entry, f, ensure_ascii=False, indent=2)

        self._send_json(201, {"entry": entry})

    def do_DELETE(self):
        parsed = urlparse(self.path)
        m = re.match(r"^/api/entries/([a-zA-Z0-9_\-]+)$", parsed.path)
        if not m:
            self._send_json(404, {"error": "not found"})
            return
        entry_id = m.group(1)
        if not ID_RE.match(entry_id):
            self._send_json(400, {"error": "invalid id"})
            return
        fpath = os.path.join(DATA_DIR, entry_id + ".json")
        if os.path.isfile(fpath):
            os.remove(fpath)
            self._send_json(200, {"ok": True})
        else:
            self._send_json(404, {"error": "not found"})


def main():
    server = ThreadingHTTPServer(("0.0.0.0", PORT), Handler)
    print(f"สมุดบันทึกอารมณ์ กำลังทำงานที่ http://localhost:{PORT}")
    print(f"ข้อมูลจะถูกเก็บเป็นไฟล์ในโฟลเดอร์: {DATA_DIR}")
    print("กด Ctrl+C เพื่อหยุดเซิร์ฟเวอร์")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nหยุดเซิร์ฟเวอร์แล้ว")
        server.shutdown()


if __name__ == "__main__":
    main()
