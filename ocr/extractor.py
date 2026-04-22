import pytesseract
<<<<<<< HEAD
import os

# Windows için Tesseract yolunu belirt (Genellikle buradadır)
if os.name == 'nt':
    pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

=======
>>>>>>> e6a7394af1d436c3fc16de8d7ba6b7647b571273
import fitz  # PyMuPDF
from pdf2image import convert_from_path
from PIL import Image
from ocr.preprocessor import preprocess_image, preprocess_for_lang
import os
import uuid
import tempfile

# Dil kodları
LANGUAGES = {
    "english": "eng",
    "turkish": "tur",
    "ukrainian": "ukr",
    "auto": "eng+tur+ukr"
}


def extract_from_image(image_path, lang="auto", preprocess=True):
    """Görüntüden metin çıkarır."""
    
    lang_code = LANGUAGES.get(lang, "eng+tur+ukr")
    
    if preprocess:
        img = preprocess_for_lang(image_path, lang_code)
    else:
        img = Image.open(image_path)
    
    config = "--oem 3 --psm 6"
    
    text = pytesseract.image_to_string(img, lang=lang_code, config=config)
    
    data = pytesseract.image_to_data(
        img, lang=lang_code, config=config,
        output_type=pytesseract.Output.DICT
    )
    
    confidences = [int(c) for c in data["conf"] if str(c).isdigit() and int(c) > 0]
    avg_confidence = sum(confidences) / len(confidences) if confidences else 0
    
    return {
        "text": text.strip(),
        "confidence": round(avg_confidence, 2),
        "language": lang,
        "type": "image"
    }


def extract_from_pdf(pdf_path, lang="auto"):
    """PDF'den metin çıkarır."""
    
    lang_code = LANGUAGES.get(lang, "eng+tur+ukr")
    
    # Önce PyMuPDF ile direkt metin çıkarmayı dene
    doc = fitz.open(pdf_path)
    direct_text = ""
    page_count = len(doc)
    
    for page in doc:
        direct_text += page.get_text()
    
    doc.close()
    
    # Eğer direkt metin varsa kullan
    if len(direct_text.strip()) > 50:
        return {
            "text": direct_text.strip(),
            "confidence": 100.0,
            "language": lang,
            "type": "pdf_direct",
            "pages": page_count
        }
    
    # Taranmış PDF ise görüntüye çevir ve OCR uygula
    images = convert_from_path(pdf_path, dpi=300)
    full_text = ""
    all_confidences = []
    
    for i, image in enumerate(images):
        temp_dir = tempfile.gettempdir()
        temp_path = os.path.join(temp_dir, f"ocr_page_{uuid.uuid4().hex}_{i}.png")
        image.save(temp_path, "PNG")
        
        result = extract_from_image(temp_path, lang=lang)
        full_text += f"\n--- Sayfa {i+1} ---\n{result['text']}\n"
        all_confidences.append(result["confidence"])
        
        os.remove(temp_path)
    
    avg_conf = sum(all_confidences) / len(all_confidences) if all_confidences else 0
    
    return {
        "text": full_text.strip(),
        "confidence": round(avg_conf, 2),
        "language": lang,
        "type": "pdf_scanned",
        "pages": len(images)
    }


def extract_text(file_path, lang="auto"):
    """Dosya türüne göre otomatik metin çıkarır."""
    
    ext = os.path.splitext(file_path)[1].lower()
    
    if ext in [".jpg", ".jpeg", ".png", ".bmp", ".tiff", ".webp"]:
        return extract_from_image(file_path, lang=lang)
    elif ext == ".pdf":
        return extract_from_pdf(file_path, lang=lang)
    else:
        raise ValueError(f"Desteklenmeyen dosya türü: {ext}")
