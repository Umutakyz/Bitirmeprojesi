import os
import re
from faster_whisper import WhisperModel

# Model boyutu: tiny / base / small / medium / large-v3-turbo / large-v3.
# large-v3-turbo: büyük modele yakın kalite, medium'dan hızlı (ilk kullanımda ~1,6 GB iner).
MODEL_SIZE = os.environ.get("WHISPER_MODEL", "large-v3-turbo")

LANGUAGES = {
    "turkish": "tr",
    "english": "en",
    "ukrainian": "uk",
    "german": "de",
    "french": "fr",
    "spanish": "es",
    "russian": "ru",
    "arabic": "ar",
    "auto": None,  # Whisper dili kendisi tespit eder (sessizlikte yanlış dil uydurabilir)
}

VOCABULARY_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "vocabulary.txt")

# Paragraf ayırma: bu kadar saniyelik sessizlikte veya bu kadar karakterden sonra yeni paragraf.
PARAGRAPH_GAP_SECONDS = 2.0
PARAGRAPH_MAX_CHARS = 500

# Türkçe toplantıda çıkan Kiril/Arap/CJK satırlar Whisper'ın sessizlikte uydurduğu çıktıdır.
MIN_LOOP_CHARS = 15

_FOREIGN_SCRIPT = re.compile(r"[Ѐ-ӿ؀-ۿ一-鿿]")

_model = None


def _get_model():
    """Modeli ilk kullanımda yükler (ilk seferde indirilir, sonra önbellekten gelir)."""
    global _model
    if _model is None:
        _model = WhisperModel(MODEL_SIZE, device="cpu", compute_type="int8")
    return _model


def _initial_prompt():
    """vocabulary.txt'deki şirket kelimelerinden Whisper'a ipucu cümlesi üretir."""
    try:
        with open(VOCABULARY_FILE, encoding="utf-8") as f:
            terms = [l.strip() for l in f if l.strip() and not l.startswith("#")]
    except OSError:
        return None
    if not terms:
        return None
    return "Bu bir toplantı kaydıdır. Geçen terimler: " + ", ".join(terms) + "."


def format_timestamp(seconds):
    seconds = int(seconds)
    return f"{seconds // 3600:02d}:{seconds % 3600 // 60:02d}:{seconds % 60:02d}"


def _build_paragraphs(segments):
    paragraphs = []
    current = None
    prev_end = 0.0
    for start, end, text in segments:
        if current is None or start - prev_end > PARAGRAPH_GAP_SECONDS or len(current["text"]) > PARAGRAPH_MAX_CHARS:
            current = {"start": start, "text": text}
            paragraphs.append(current)
        else:
            current["text"] += " " + text
        prev_end = end
    return paragraphs


def transcribe_audio(audio_path, lang="auto", progress_cb=None):
    """Sesi yerel Whisper modeliyle metne çevirir (ücretsiz, internetsiz, süre sınırsız).

    progress_cb(yüzde) uzun kayıtlarda ilerlemeyi bildirmek için çağrılır.
    """
    lang_code = LANGUAGES.get(lang)

    try:
        segments, info = _get_model().transcribe(
            audio_path,
            language=lang_code,
            beam_size=5,
            vad_filter=True,  # sessiz kısımları atla
            vad_parameters={"min_silence_duration_ms": 500},
            # Önceki cümleyi bağlam almayı kapat: "hala hala hala…" gibi tekrar döngülerini keser.
            condition_on_previous_text=False,
            initial_prompt=_initial_prompt() if lang_code == "tr" else None,
        )

        kept = []
        repeat_count = 0
        last_norm = None
        for seg in segments:
            text = seg.text.strip()
            if progress_cb and info.duration:
                progress_cb(min(99.0, seg.end / info.duration * 100))
            if not text:
                continue
            if lang_code == "tr" and _FOREIGN_SCRIPT.search(text):
                continue
            # Uzun bir cümle art arda 2'den fazla tekrarlanırsa fazlasını at (Whisper döngüsü).
            # Kısa tekrarlar ("Evet. Evet. Evet.") gerçek konuşma olabilir, dokunma.
            norm = re.sub(r"\W+", " ", text.lower()).strip()
            repeat_count = repeat_count + 1 if norm == last_norm else 0
            last_norm = norm
            if repeat_count >= 2 and len(norm) >= MIN_LOOP_CHARS:
                continue
            kept.append((seg.start, seg.end, text))
    except Exception as e:
        raise ValueError(f"Ses dosyası işlenemedi: {e}")

    paragraphs = _build_paragraphs(kept)
    plain = "\n\n".join(p["text"] for p in paragraphs)
    stamped = "\n\n".join(f"[{format_timestamp(p['start'])}] {p['text']}" for p in paragraphs)

    return {
        "text": plain if plain else "(Ses anlaşılamadı veya sessiz)",
        "text_timestamped": stamped if stamped else None,
        "paragraphs": paragraphs,
        "duration": round(info.duration, 1),
        "confidence": round(info.language_probability * 100, 1),
        "language": info.language,
        "type": f"audio (Whisper {MODEL_SIZE})",
    }
