"""Çeviri sonuçlarını diske (history/ klasörü, JSON) kaydeder ve listeler."""
import json
import os
import re
import threading
import time
import uuid

HISTORY_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "history")
_ID_RE = re.compile(r"^[0-9a-f]{32}$")
_lock = threading.Lock()


def _path(record_id):
    if not _ID_RE.match(record_id or ""):
        return None  # path traversal'a karşı: sadece uuid hex kabul
    return os.path.join(HISTORY_DIR, f"{record_id}.json")


def save(result, filename):
    """Sonucu kaydeder, kayıt id'sini döndürür."""
    os.makedirs(HISTORY_DIR, exist_ok=True)
    record_id = uuid.uuid4().hex
    record = dict(result)
    record.update({"id": record_id, "filename": filename, "created": time.time()})
    path = _path(record_id)
    tmp = path + ".tmp"
    with _lock:
        with open(tmp, "w", encoding="utf-8") as f:
            json.dump(record, f, ensure_ascii=False)
        os.replace(tmp, path)  # yarım dosya kalmasın
    return record_id


def get(record_id):
    path = _path(record_id)
    if not path or not os.path.exists(path):
        return None
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def delete(record_id):
    path = _path(record_id)
    if not path or not os.path.exists(path):
        return False
    os.remove(path)
    return True


def list_items():
    """Metin içermeyen özet liste, en yeniden eskiye."""
    if not os.path.isdir(HISTORY_DIR):
        return []
    items = []
    for name in os.listdir(HISTORY_DIR):
        if not name.endswith(".json"):
            continue
        try:
            with open(os.path.join(HISTORY_DIR, name), encoding="utf-8") as f:
                r = json.load(f)
            items.append({
                "id": r["id"],
                "filename": r.get("filename", ""),
                "created": r.get("created", 0),
                "type": r.get("type", ""),
                "language": r.get("language", ""),
                "duration": r.get("duration"),
                "chars": len(r.get("text", "")),
            })
        except (OSError, ValueError, KeyError):
            continue  # bozuk dosyayı listede atla
    return sorted(items, key=lambda i: i["created"], reverse=True)
