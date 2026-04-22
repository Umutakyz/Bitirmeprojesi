import cv2
import numpy as np
from PIL import Image


def preprocess_image(image_path):
    """Görüntüyü OCR için optimize eder."""
    
    # Görüntüyü oku
    img = cv2.imread(image_path)
    
    if img is None:
        raise ValueError(f"Görüntü okunamadı: {image_path}")
    
    # Griye çevir
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # Gürültü gider
    denoised = cv2.fastNlMeansDenoising(gray, h=10)
    
    # Kontrast artır
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    enhanced = clahe.apply(denoised)
    
    # Eşikleme (siyah-beyaz)
    _, thresh = cv2.threshold(
        enhanced, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU
    )
    
    # PIL formatına çevir (pytesseract için)
    result = Image.fromarray(thresh)
    
    return result


def preprocess_for_lang(image_path, lang):
    """Dile göre özel ön işleme."""
    
    img = cv2.imread(image_path)
    
    if img is None:
        raise ValueError(f"Görüntü okunamadı: {image_path}")
    
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # Ukraynaca ve Türkçe için ekstra keskinleştirme
    if lang in ["ukr", "tur"]:
        kernel = np.array([[0, -1, 0],
                           [-1, 5, -1],
                           [0, -1, 0]])
        gray = cv2.filter2D(gray, -1, kernel)
    
    _, thresh = cv2.threshold(
        gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU
    )
    
    return Image.fromarray(thresh)
