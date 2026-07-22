import os
import speech_recognition as sr
from pydub import AudioSegment
from pydub.utils import make_chunks
import math

LANGUAGES = {
    "turkish": "tr-TR",
    "english": "en-US",
    "ukrainian": "uk-UA",
    "german": "de-DE",
    "french": "fr-FR",
    "spanish": "es-ES",
    "russian": "ru-RU",
    "arabic": "ar-SA",
    "auto": "tr-TR"
}

def transcribe_audio(audio_path, lang="auto"):
    """
    Sesi parçalara bölerek metne çevirir. 
    Windows dosya kilitleme hatalarını önlemek için güvenli temizleme içerir.
    """
    lang_code = LANGUAGES.get(lang, "tr-TR")
    
    try:
        audio = AudioSegment.from_file(audio_path)
    except Exception as e:
        raise ValueError(f"Ses dosyası yüklenemedi: {str(e)}")

    # 30 saniyelik parçalar
    chunk_length_ms = 30000 
    chunks = make_chunks(audio, chunk_length_ms)
    
    recognizer = sr.Recognizer()
    full_text = []
    
    # Geçici klasör
    temp_dir = "temp_chunks"
    os.makedirs(temp_dir, exist_ok=True)

    try:
        for i, chunk in enumerate(chunks):
            chunk_name = os.path.join(temp_dir, f"chunk{i}.wav")
            chunk.export(chunk_name, format="wav")
            
            # Dosyayı oku ve içeriği belleğe al
            text = ""
            try:
                with sr.AudioFile(chunk_name) as source:
                    recognizer.adjust_for_ambient_noise(source, duration=0.1)
                    audio_data = recognizer.record(source)
                    text = recognizer.recognize_google(audio_data, language=lang_code)
                    if text:
                        full_text.append(text)
            except sr.UnknownValueError:
                pass # Anlaşılamayan parçayı atla
            except Exception as e:
                print(f"Parça {i} işlenirken hata: {e}")
            
            # DOSYA KİLİDİNİ ÇÖZMEK İÇİN: 'with' bloğu bittikten sonra silme işlemini yapıyoruz
            if os.path.exists(chunk_name):
                try:
                    os.remove(chunk_name)
                except:
                    pass # Silinemezse sonraki temizlikte silinecek

        result_text = " ".join(full_text)
        
        return {
            "text": result_text if result_text else "(Ses anlaşılamadı veya sessiz)",
            "confidence": 100.0,
            "language": lang,
            "type": "audio (parçalı işleme)",
            "chunks_total": len(chunks)
        }

    finally:
        # En son tüm klasörü temizle
        if os.path.exists(temp_dir):
            for f in os.listdir(temp_dir):
                try:
                    # Önce dosyanın kullanımda olup olmadığını kontrol etmeden silmeyi dene
                    os.remove(os.path.join(temp_dir, f))
                except:
                    pass
            try:
                os.rmdir(temp_dir)
            except:
                pass
