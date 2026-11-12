"""Uzun işleri (ses çevirme) arka planda, sırayla çalıştıran basit iş kuyruğu."""
import threading
import time
import uuid
from concurrent.futures import ThreadPoolExecutor

from ocr import history

# Whisper CPU'yu doldurur; aynı anda tek iş, gerisi sırada bekler.
_executor = ThreadPoolExecutor(max_workers=1)
_jobs = {}
_lock = threading.Lock()
_KEEP_SECONDS = 24 * 3600


def _cleanup():
    cutoff = time.time() - _KEEP_SECONDS
    for jid in [j for j, v in _jobs.items() if v["status"] in ("done", "error") and v["created"] < cutoff]:
        del _jobs[jid]


def submit(filename, work):
    """work(update) -> sonuç dict. update(progress, phase) ilerlemeyi bildirir."""
    job_id = uuid.uuid4().hex
    with _lock:
        _cleanup()
        _jobs[job_id] = {
            "id": job_id, "filename": filename, "status": "queued",
            "phase": "queued", "progress": 0.0, "created": time.time(),
            "error": None, "result_id": None,
        }

    def update(progress=None, phase=None):
        with _lock:
            job = _jobs[job_id]
            if progress is not None:
                job["progress"] = round(min(max(progress, 0.0), 100.0), 1)
            if phase:
                job["phase"] = phase

    def run():
        with _lock:
            _jobs[job_id]["status"] = "running"
            _jobs[job_id]["phase"] = "loading_model"
        try:
            result = work(update)
            result_id = history.save(result, filename)
            with _lock:
                _jobs[job_id].update(status="done", progress=100.0, phase="done", result_id=result_id)
        except Exception as e:  # noqa: BLE001 - hata kullanıcıya gösterilecek
            with _lock:
                _jobs[job_id].update(status="error", error=str(e))

    _executor.submit(run)
    return job_id


def get(job_id):
    with _lock:
        job = _jobs.get(job_id)
        return dict(job) if job else None
