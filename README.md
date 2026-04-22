# OCR & Audio Transcription Web App 🎙️📄

This project is a modern, multimodal web application that can extract text from images, PDFs, and audio files and instantly translate the extracted text into the desired language. Designed as a university graduation project, it has a production-ready infrastructure.

## 🚀 Features
- **Multiple Format Support:** Images (PNG, JPG, etc.), PDF files, and audio recordings (MP3, WAV, WEBM, etc.).
- **Dynamic Audio Recording:** Recording and transcribing audio directly from the microphone via the web interface.
- **Smart PDF Processing:** Automatically detects and processes scanned or regular PDFs.
- **Instant Translation Module:** Translates the extracted text into 8 different languages ​​in seconds.
- **Image Processing (OpenCV):** Clarify and read text in blurry or noisy (noisy) images using special filters.
- **Dual Language Support:** Dynamic modern web design that can switch between English and Turkish with a single click.
- **Stable Infrastructure:** UUID-based collision avoidance infrastructure capable of managing file uploads by hundreds of users simultaneously.

---

## 🛠️ Installation (Installation Steps are Valid for Mac and Windows)

For this application to function correctly, some system tools other than Python must be installed in the background.

### 1. Install the Requirements on Your System

The application requires Tesseract, Poppler, and FFMpeg to perform OCR and speech reading operations. Install the following according to your operating system:

**For Mac (macOS):**
Open your terminal and install the following using the homebrew tool:
```bash
brew install tesseract
brew install poppler
brew install ffmpeg
```

**For Windows:**
- **Tesseract-OCR:** Download and install the [Tesseract installer](https://github.com/UB-Mannheim/tesseract/wiki).
- **Poppler:** Download the PDF reader engine [Poppler for Windows](http://blog.alivate.com.au/poppler-windows/). (You must add the `bin` directory in the installation folder to your system environment variables (PATH).)
- **FFMPEG:** Download [FFMPEG](https://ffmpeg.org/download.html) for audio conversion and add it to your System Environment Variables (PATH).

*(Note: After installing Tesseract on Windows, the OCR module in the code may need to recognize it. If you haven't installed it in the default folder, you may need to add the line `pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'` to the project).*

### 2. Install Python Libraries
Go to the project folder with CMD or Terminal and install a virtual environment and download the (optional) packages:

```bash
# Download the necessary dependencies
pip install -r requirements.txt
```

### 3. Launch the Application
After completing all installations, in the main directory:
```bash
python app.py
```
then you can go to your application from your browser: `http://localhost:5000`

---
**Developer:** Umut Ferhat Akyüz

**License:** MIT License
