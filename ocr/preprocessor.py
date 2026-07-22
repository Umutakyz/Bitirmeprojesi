import cv2
import numpy as np
from PIL import Image


def preprocess_image(image_path):
    """Görüntüyü OCR için optimize eder."""
    return preprocess_for_lang(image_path, "auto")


def preprocess_for_lang(image_path, lang):
    """Dile göre özel ön işleme ve genel OCR iyileştirmeleri."""
    
    img = cv2.imread(image_path)
    
    if img is None:
        raise ValueError(f"Görüntü okunamadı: {image_path}")
    
    # 1. Ölçeklendirme (Tesseract 300 DPI civarı görüntüleri sever)
    # Eğer resim çok küçükse karakterler bozulur, 2 kat büyütüyoruz
    height, width = img.shape[:2]
    if width < 1000:
        scaling_factor = 2
        img = cv2.resize(img, None, fx=scaling_factor, fy=scaling_factor, interpolation=cv2.INTER_CUBIC)
    
    # 2. Griye çevir
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # 3. Gürültü gider (Bilateral Filter kenarları korur)
    denoised = cv2.bilateralFilter(gray, 9, 75, 75)
    
    # 4. Kontrast artır (CLAHE - Yerel kontrast iyileştirme)
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    enhanced = clahe.apply(denoised)
    
    # 5. Keskinleştirme (Unsharp Masking)
    gaussian_3 = cv2.GaussianBlur(enhanced, (0, 0), 2.0)
    sharpened = cv2.addWeighted(enhanced, 1.5, gaussian_3, -0.5, 0)
    
    # 6. Adaptif Eşikleme (Siyah-Beyaz yapma - ışık farklarını dengeler)
    thresh = cv2.adaptiveThreshold(
        sharpened, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2
    )
    
    # PIL formatına çevir (pytesseract için)
    result = Image.fromarray(thresh)
    
    return result
