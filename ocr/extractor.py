import pytesseract
import os

# Windows için Tesseract yolunu belirt
if os.name == 'nt':
    pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

import fitz  # PyMuPDF
from pdf2image import convert_from_path
from PIL import Image
from ocr.preprocessor import preprocess_image, preprocess_for_lang
import uuid
import tempfile

# Dil kodları
LANGUAGES = {
    "english": "eng",
    "turkish": "tur",
    "ukrainian": "ukr",
    "german": "deu",
    "french": "fra",
    "spanish": "spa",
    "russian": "rus",
    "arabic": "ara",
    "auto": "eng+tur+ukr+deu+fra+spa+rus+ara"
}

def extract_text(file_path, lang="auto"):
    """Dosya tipine göre metin çıkarır (Resim veya PDF)."""
    ext = file_path.rsplit('.', 1)[1].lower()
    
    if ext == 'pdf':
        return extract_from_pdf(file_path, lang=lang)
    else:
        return extract_from_image(file_path, lang=lang)

def extract_from_image(image_path, lang="auto", preprocess=True):
    """Görüntüden metin çıkarır."""
    lang_code = LANGUAGES.get(lang, "eng+tur+ukr")
    
    if preprocess:
        img = preprocess_for_lang(image_path, lang_code)
    else:
        img = Image.open(image_path)
    
    # Proje içindeki yerel tessdata klasörünü kullan
    tessdata_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "tessdata"))
    config = f'--tessdata-dir "{tessdata_dir}" --oem 3 --psm 3'
    
    text = pytesseract.image_to_string(img, lang=lang_code, config=config)
    return text.strip()

def extract_from_pdf(pdf_path, lang="auto"):
    """PDF dosyasından metin çıkarır (Hem metin tabanlı hem taranmış)."""
    text = ""
    
    try:
        # 1. Önce metin tabanlı mı diye kontrol et (PyMuPDF ile)
        doc = fitz.open(pdf_path)
        for page in doc:
            text += page.get_text()
        doc.close()
        
        # Eğer metin çok azsa veya boşsa, taranmış PDF olabilir, OCR yap
        if len(text.strip()) < 50:
            text = ""
            # PDF'i resimlere dönüştür
            images = convert_from_path(pdf_path)
            for i, image in enumerate(images):
                # Geçici resim dosyası oluştur
                temp_name = f"temp_page_{i}_{uuid.uuid4()}.png"
                image.save(temp_name)
                text += extract_from_image(temp_name, lang=lang) + "\n\n"
                # Temizle
                if os.path.exists(temp_name):
                    os.remove(temp_name)
                    
    except Exception as e:
        print(f"PDF işleme hatası: {e}")
        
    return text.strip()
