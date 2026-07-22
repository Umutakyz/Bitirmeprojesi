import requests
from deep_translator import GoogleTranslator

LANGUAGES = {
    "Türkçe": "tr",
    "İngilizce": "en",
    "Ukraynaca": "uk",
    "Almanca": "de",
    "Fransızca": "fr",
    "İspanyolca": "es",
    "Rusça": "ru",
    "Arapça": "ar"
}

# Hızlı çeviri için HTTP bağlantı havuzu (Session) oluştur
_session = requests.Session()

def _translate_chunk_fast(chunk, target_code):
    """Doğrudan Google Translate API'sine persistent session ile istek atarak çok hızlı çeviri yapar."""
    try:
        url = "https://translate.googleapis.com/translate_a/single"
        params = {
            "client": "gtx",
            "sl": "auto",
            "tl": target_code,
            "dt": "t",
            "q": chunk
        }
        response = _session.get(url, params=params, timeout=5)
        response.raise_for_status()
        data = response.json()
        
        # Çeviri sonuç parçalarını birleştir
        translated_parts = []
        if data and isinstance(data, list) and len(data) > 0 and data[0]:
            for part in data[0]:
                if part and len(part) > 0 and part[0]:
                    translated_parts.append(part[0])
            return "".join(translated_parts)
    except Exception as e:
        print(f"Hızlı çeviri hatası, yedek yönteme geçiliyor: {e}")
    
    # Fallback (Yedek Yöntem)
    return GoogleTranslator(source="auto", target=target_code).translate(chunk)


def translate_text(text, target_lang_name):
    """Metni hedef dile çevirir."""

    if not text or not text.strip():
        raise ValueError("Çevrilecek metin boş olamaz")

    target_code = LANGUAGES.get(target_lang_name)

    if not target_code:
        raise ValueError(f"Desteklenmeyen dil: {target_lang_name}")

    # Google Translate 5000 karakter limiti var, parçalara böl
    max_chunk = 4500
    if len(text) <= max_chunk:
        return _translate_chunk_fast(text, target_code)

    # Uzun metin için parçalara böl
    chunks = [text[i:i+max_chunk] for i in range(0, len(text), max_chunk)]
    translated_chunks = []

    for chunk in chunks:
        result = _translate_chunk_fast(chunk, target_code)
        translated_chunks.append(result)

    return "\n".join(translated_chunks)


def get_supported_languages():
    return list(LANGUAGES.keys())
