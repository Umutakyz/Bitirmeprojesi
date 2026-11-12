import os
import uuid
from flask import Flask, request, jsonify, render_template, send_file
from werkzeug.utils import secure_filename
from ocr.extractor import extract_text
from ocr.translator import translate_text, get_supported_languages
from ocr.transcriber import transcribe_audio
from ocr import history, jobs
from fpdf import FPDF
import io

app = Flask(__name__)

# Yapılandırma
UPLOAD_FOLDER = 'uploads'
AUDIO_EXTENSIONS = {'mp3', 'wav', 'ogg', 'm4a', 'webm', 'flac'}
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'bmp', 'tiff', 'webp', 'pdf', 'mp3', 'wav', 'ogg', 'm4a', 'webm', 'flac'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 512 * 1024 * 1024  # 512MB max upload (1+ saatlik ses için)

# Upload klasörünü oluştur
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/extract', methods=['POST'])
def extract():
    if 'file' not in request.files:
        return jsonify({'error': 'Dosya seçilmedi'}), 400
    
    file = request.files['file']
    lang = request.form.get('lang', 'auto')
    
    if file.filename == '':
        return jsonify({'error': 'Dosya seçilmedi'}), 400
    
    if file and allowed_file(file.filename):
        # Dosyayı güvenli bir isimle kaydet
        filename = str(uuid.uuid4()) + "_" + secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        ext = filename.rsplit('.', 1)[1].lower()

        if ext in AUDIO_EXTENSIONS:
            # Ses uzun sürer: arka plan kuyruğuna at, hemen job_id dön (ilerleme /jobs/<id>'den izlenir)
            def work(update):
                try:
                    return transcribe_audio(filepath, lang=lang, progress_cb=lambda p: update(p, 'transcribing'))
                finally:
                    if os.path.exists(filepath):
                        os.remove(filepath)

            job_id = jobs.submit(file.filename, work)
            return jsonify({'job_id': job_id}), 202

        try:
            # OCR (Resim veya PDF) hızlıdır, doğrudan yanıtla
            text = extract_text(filepath, lang=lang)
            result = {
                'text': text,
                'confidence': 100.0,
                'language': lang,
                'type': 'ocr'
            }
            result['id'] = history.save(result, file.filename)
            return jsonify(result)

        except Exception as e:
            return jsonify({'error': str(e)}), 500

        finally:
            if os.path.exists(filepath):
                os.remove(filepath)

    return jsonify({'error': 'Desteklenmeyen dosya formatı'}), 400

@app.route('/jobs/<job_id>')
def job_status(job_id):
    job = jobs.get(job_id)
    if not job:
        return jsonify({'error': 'İş bulunamadı (sunucu yeniden başlatılmış olabilir)'}), 404
    return jsonify(job)

@app.route('/history')
def history_list():
    return jsonify({'items': history.list_items()})

@app.route('/history/<record_id>', methods=['GET'])
def history_get(record_id):
    record = history.get(record_id)
    if not record:
        return jsonify({'error': 'Kayıt bulunamadı'}), 404
    return jsonify(record)

@app.route('/history/<record_id>', methods=['DELETE'])
def history_delete(record_id):
    if not history.delete(record_id):
        return jsonify({'error': 'Kayıt bulunamadı'}), 404
    return jsonify({'ok': True})

@app.route('/translate', methods=['POST'])
def translate():
    data = request.get_json()
    text = data.get('text', '')
    target_lang = data.get('target_lang', 'İngilizce')
    
    if not text:
        return jsonify({'error': 'Metin bulunamadı'}), 400
    
    try:
        translated_text = translate_text(text, target_lang)
        return jsonify({'translated_text': translated_text})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/languages')
def languages():
    return jsonify({'languages': get_supported_languages()})

@app.route("/download_pdf", methods=["POST"])
def download_pdf():
    data = request.get_json()
    text = data.get("text", "")
    filename = data.get("filename", "sonuc.pdf")

    if not text:
        return jsonify({"error": "Metin bulunamadı"}), 400

    try:
        pdf = FPDF()
        pdf.add_page()
        
        font_path = r"C:\Windows\Fonts\arial.ttf"
        if os.path.exists(font_path):
            pdf.add_font("Arial", "", font_path)
            pdf.set_font("Arial", size=12)
            font_name = "Arial"
        else:
            pdf.set_font("helvetica", size=12)
            font_name = "helvetica"
        
        pdf.set_font(font_name, style="B", size=16)
        pdf.cell(190, 10, text="AI Scan & Transcribe - Sonuc Raporu", new_x="LMARGIN", new_y="NEXT", align="C")
        pdf.ln(10)
        
        pdf.set_font(font_name, size=11)
        pdf.multi_cell(0, 10, text=text)
        
        pdf_output = pdf.output()
        
        return send_file(
            io.BytesIO(pdf_output),
            mimetype="application/pdf",
            as_attachment=True,
            download_name=filename
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # use_reloader=False: kod değişince sunucu yeniden başlayıp çalışan ses işini öldürmesin
    app.run(debug=True, use_reloader=False, port=int(os.environ.get("PORT", 5001)))
