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
        translated = GoogleTranslator(source="auto", target=target_code).translate(text)
        return translated

    # Uzun metin için parçalara böl
    chunks = [text[i:i+max_chunk] for i in range(0, len(text), max_chunk)]
    translated_chunks = []

    for chunk in chunks:
        result = GoogleTranslator(source="auto", target=target_code).translate(chunk)
        translated_chunks.append(result)

    return "\n".join(translated_chunks)


def get_supported_languages():
    return list(LANGUAGES.keys())
