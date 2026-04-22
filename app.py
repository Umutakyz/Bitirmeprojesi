import os
import uuid
<<<<<<< HEAD
from flask import Flask, request, jsonify, render_template, send_file
=======
from flask import Flask, request, jsonify, render_template
>>>>>>> e6a7394af1d436c3fc16de8d7ba6b7647b571273
from werkzeug.utils import secure_filename
from ocr.extractor import extract_text
from ocr.translator import translate_text, get_supported_languages
from ocr.transcriber import transcribe_audio
<<<<<<< HEAD
from fpdf import FPDF
import io
=======
>>>>>>> e6a7394af1d436c3fc16de8d7ba6b7647b571273

app = Flask(__name__)

app.config["UPLOAD_FOLDER"] = "uploads"
app.config["MAX_CONTENT_LENGTH"] = 16 * 1024 * 1024
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "bmp", "tiff", "webp", "pdf"}
ALLOWED_AUDIO_EXTENSIONS = {"wav", "mp3", "ogg", "m4a", "webm", "flac", "mp4"}


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

def allowed_audio_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_AUDIO_EXTENSIONS


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/extract", methods=["POST"])
def extract():
    if "file" not in request.files:
        return jsonify({"error": "Dosya bulunamadı"}), 400

    file = request.files["file"]
    lang = request.form.get("lang", "auto")

    if file.filename == "":
        return jsonify({"error": "Dosya seçilmedi"}), 400

    if not allowed_file(file.filename):
        return jsonify({"error": "Desteklenmeyen dosya türü"}), 400

    filename = secure_filename(file.filename)
    unique_filename = f"{uuid.uuid4().hex}_{filename}"
    filepath = os.path.join(app.config["UPLOAD_FOLDER"], unique_filename)
    file.save(filepath)

    try:
        result = extract_text(filepath, lang=lang)
        return jsonify({
            "success": True,
            "text": result["text"],
            "confidence": result["confidence"],
            "language": result["language"],
            "type": result["type"]
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if os.path.exists(filepath):
            os.remove(filepath)


@app.route("/transcribe", methods=["POST"])
def transcribe():
    if "file" not in request.files:
        return jsonify({"error": "Dosya bulunamadı"}), 400

    file = request.files["file"]
    lang = request.form.get("lang", "auto")

    if file.filename == "":
        return jsonify({"error": "Dosya seçilmedi"}), 400

    if not allowed_audio_file(file.filename):
        return jsonify({"error": "Desteklenmeyen ses dosyası türü"}), 400

    filename = secure_filename(file.filename)
    unique_filename = f"{uuid.uuid4().hex}_{filename}"
    filepath = os.path.join(app.config["UPLOAD_FOLDER"], unique_filename)
    file.save(filepath)

    try:
        result = transcribe_audio(filepath, lang=lang)
        return jsonify({
            "success": True,
            "text": result["text"],
            "confidence": result["confidence"],
            "language": result["language"],
            "type": result["type"]
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if os.path.exists(filepath):
            os.remove(filepath)


@app.route("/translate", methods=["POST"])
def translate():
    data = request.get_json()

    if not data or "text" not in data or "target_lang" not in data:
        return jsonify({"error": "Metin ve hedef dil gerekli"}), 400

    try:
        translated = translate_text(data["text"], data["target_lang"])
        return jsonify({
            "success": True,
            "translated_text": translated,
            "target_lang": data["target_lang"]
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/languages")
def languages():
    return jsonify({"languages": get_supported_languages()})


<<<<<<< HEAD
@app.route("/download_pdf", methods=["POST"])
def download_pdf():
    data = request.get_json()
    text = data.get("text", "")
    filename = data.get("filename", "sonuc.pdf")

    if not text:
        return jsonify({"error": "Metin bulunamadı"}), 400

    try:
        # PDF Oluştur (fpdf2)
        pdf = FPDF()
        pdf.add_page()
        
        # Windows Sistem Fontunu Ekle (Türkçe karakterler için)
        # Arial genellikle her Windows'ta bulunur
        font_path = r"C:\Windows\Fonts\arial.ttf"
        if os.path.exists(font_path):
            pdf.add_font("Arial", "", font_path)
            pdf.set_font("Arial", size=12)
            font_name = "Arial"
        else:
            # Font bulunamazsa standart fonta dön (Soru işareti riski var)
            pdf.set_font("helvetica", size=12)
            font_name = "helvetica"
        
        # Başlık
        pdf.set_font(font_name, style="B", size=16)
        pdf.cell(190, 10, txt="AI Scan & Transcribe - Sonuc Raporu", ln=True, align="C")
        pdf.ln(10)
        
        # İçerik (Unicode desteğiyle doğrudan metni yazıyoruz)
        pdf.set_font(font_name, size=11)
        # fpdf2'de Unicode (UTF-8) doğrudan desteklenir
        pdf.multi_cell(0, 10, txt=text)
        
        # PDF'i belleğe yaz
        pdf_output = pdf.output()
        
        return send_file(
            io.BytesIO(pdf_output),
            mimetype="application/pdf",
            as_attachment=True,
            download_name=filename
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 500


=======
>>>>>>> e6a7394af1d436c3fc16de8d7ba6b7647b571273
@app.route("/health")
def health():
    return jsonify({"status": "ok"})


if __name__ == "__main__":
    os.makedirs("uploads", exist_ok=True)
    app.run(debug=True)
