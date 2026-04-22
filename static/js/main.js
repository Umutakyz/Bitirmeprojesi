const i18n = {
    tr: {
        title: "📄 OCR & Ses Metin Çıkarma",
        subtitle: "Fotoğraf, PDF veya Ses dosyası yükle, metni anında çıkar ve çevir",
        dropzone_title: "Dosyayı buraya sürükle veya tıkla",
        dropzone_desc: "PNG, JPG, PDF, MP3, WAV, vb. — Max 16MB",
        record_btn: "🎤 Ses Kaydet",
        recording: "🔴 Kaydediliyor... ",
        stop_record: "⏹️ Kaydı Durdur",
        ocr_lang: "OCR Dili:",
        lang_auto: "🌐 Otomatik",
        lang_en: "🇬🇧 İngilizce",
        lang_tr: "🇹🇷 Türkçe",
        lang_uk: "🇺🇦 Ukraynaca",
        extract_btn: "Metni Çıkar / Sesi Çevir",
        loading_ocr: "OCR işlemi yapılıyor...",
        loading_audio: "Ses metne çevriliyor...",
        loading_trans: "Çeviri yapılıyor...",
        extracted_text: "Çıkarılan Metin",
        copy_btn: "📋 Kopyala",
        copied: "✅ Kopyalandı!",
        download_btn: "⬇️ TXT İndir",
        clear_btn: "🗑️ Temizle",
        translate_title: "🌍 Çeviri",
        target_lang: "Hedef Dil:",
        translate_btn: "Çevir",
        translated_text_title: "Çevrilmiş Metin",
        error_file: "Desteklenmeyen dosya türü",
        error_server: "Sunucuya bağlanılamadı: ",
        error_no_text: "Çevrilecek metin yok!",
        error_mic: "Mikrofona erişilemedi: ",
        no_text: "(Metin bulunamadı)",
        meta_conf: "🎯 Güven: %",
        meta_lang: "🌐 Dil: ",
        meta_type: "📄 Tür: ",
<<<<<<< HEAD
        translated_to: "diline çevrildi",
        footer_text: "Mezuniyet Projesi",
        about_me: "Ben Umut Ferhat Akyüz. Igor Sikorsky Kyiv Politeknik Enstitüsü'nde 4. sınıf öğrencisiyim. Bu benim bitirme projemdir."
=======
        translated_to: "diline çevrildi"
>>>>>>> e6a7394af1d436c3fc16de8d7ba6b7647b571273
    },
    en: {
        title: "📄 OCR & Audio Transcription",
        subtitle: "Upload a Photo, PDF or Audio file to extract instantly and translate",
        dropzone_title: "Drag and drop the file here or click",
        dropzone_desc: "PNG, JPG, PDF, MP3, WAV, etc. — Max 16MB",
        record_btn: "🎤 Record Audio",
        recording: "🔴 Recording... ",
        stop_record: "⏹️ Stop Recording",
        ocr_lang: "OCR Language:",
        lang_auto: "🌐 Auto",
        lang_en: "🇬🇧 English",
        lang_tr: "🇹🇷 Turkish",
        lang_uk: "🇺🇦 Ukrainian",
        extract_btn: "Extract Text / Transcribe Audio",
        loading_ocr: "Processing OCR...",
        loading_audio: "Transcribing audio...",
        loading_trans: "Translating...",
        extracted_text: "Extracted Text",
        copy_btn: "📋 Copy",
        copied: "✅ Copied!",
        download_btn: "⬇️ Download TXT",
        clear_btn: "🗑️ Clear",
        translate_title: "🌍 Translation",
        target_lang: "Target Language:",
        translate_btn: "Translate",
        translated_text_title: "Translated Text",
        error_file: "Unsupported file type",
        error_server: "Could not connect to server: ",
        error_no_text: "No text to translate!",
        error_mic: "Microphone access denied: ",
        no_text: "(No text found)",
        meta_conf: "🎯 Confidence: %",
        meta_lang: "🌐 Lang: ",
        meta_type: "📄 Type: ",
<<<<<<< HEAD
        translated_to: "translated to",
        footer_text: "Graduation Project",
        about_me: "I am Umut Ferhat Akyüz. I am a 4th-year student at Igor Sikorsky Kyiv Polytechnic Institute. This is my graduation project."
=======
        translated_to: "translated to"
>>>>>>> e6a7394af1d436c3fc16de8d7ba6b7647b571273
    }
};

let currentLang = "tr";

const dropZone = document.getElementById("dropZone");
const fileInput = document.getElementById("fileInput");
const extractBtn = document.getElementById("extractBtn");
const previewSection = document.getElementById("previewSection");
const imagePreview = document.getElementById("imagePreview");
const audioPreview = document.getElementById("audioPreview");
const fileInfo = document.getElementById("fileInfo");
const loading = document.getElementById("loading");
const loadingText = document.getElementById("loadingText");
const resultSection = document.getElementById("resultSection");
const resultText = document.getElementById("resultText");
const resultMeta = document.getElementById("resultMeta");
const errorSection = document.getElementById("errorSection");
const errorMessage = document.getElementById("errorMessage");
const copyBtn = document.getElementById("copyBtn");
const downloadBtn = document.getElementById("downloadBtn");
const clearBtn = document.getElementById("clearBtn");
const langSelect = document.getElementById("langSelect");
const translateBtn = document.getElementById("translateBtn");
const targetLang = document.getElementById("targetLang");
const translationResult = document.getElementById("translationResult");
const translatedText = document.getElementById("translatedText");
const translationMeta = document.getElementById("translationMeta");
const copyTranslatedBtn = document.getElementById("copyTranslatedBtn");
const downloadTranslatedBtn = document.getElementById("downloadTranslatedBtn");
const recordBtn = document.getElementById("recordBtn");
const recordingIndicator = document.getElementById("recordingIndicator");
const recordTime = document.getElementById("recordTime");
<<<<<<< HEAD
const downloadPdfBtn = document.getElementById("downloadPdfBtn");
const downloadTranslatedPdfBtn = document.getElementById("downloadTranslatedPdfBtn");
=======
>>>>>>> e6a7394af1d436c3fc16de8d7ba6b7647b571273

let selectedFile = null;

function setLanguage(lang) {
    currentLang = lang;
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        if (i18n[lang][key]) {
            el.innerHTML = i18n[lang][key]; 
        }
    });

    if (resultText.value === i18n["tr"].no_text || resultText.value === i18n["en"].no_text) {
        resultText.value = i18n[currentLang].no_text;
    }
    
    document.getElementById("langToggleBtn").textContent = lang === "tr" ? "🇬🇧 Switch to English" : "🇹🇷 Türkçe'ye Geç";
    
    if (recordBtn.classList.contains("recording")) {
        recordBtn.textContent = i18n[currentLang].stop_record;
    } else {
        recordBtn.textContent = i18n[currentLang].record_btn;
    }
    
    copyBtn.textContent = i18n[currentLang].copy_btn;
    copyTranslatedBtn.textContent = i18n[currentLang].copy_btn;
}

document.getElementById("langToggleBtn").addEventListener("click", () => {
    setLanguage(currentLang === "tr" ? "en" : "tr");
});

// Tıklayınca dosya seç
dropZone.addEventListener("click", () => fileInput.click());

fileInput.addEventListener("change", (e) => {
    if (e.target.files[0]) handleFile(e.target.files[0]);
});

// Sürükle bırak
dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZone.classList.add("dragover");
});

dropZone.addEventListener("dragleave", () => {
    dropZone.classList.remove("dragover");
});

dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropZone.classList.remove("dragover");
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
});

let mediaRecorder;
let audioChunks = [];
let recordInterval;
let recordStartTime;

recordBtn.addEventListener("click", async () => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
        mediaRecorder.stop();
        return;
    }

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        audioChunks = [];

        mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) audioChunks.push(e.data);
        };

        mediaRecorder.onstop = () => {
            clearInterval(recordInterval);
            recordBtn.textContent = i18n[currentLang].record_btn;
            recordBtn.classList.remove("recording");
            recordingIndicator.style.display = "none";
            
            const mimeType = mediaRecorder.mimeType || "audio/webm";
            let ext = "webm";
            if (mimeType.includes("mp4")) ext = "mp4";
            else if (mimeType.includes("ogg")) ext = "ogg";
            else if (mimeType.includes("mpeg")) ext = "mp3";
            
            const audioBlob = new Blob(audioChunks, { type: mimeType });
            const file = new File([audioBlob], `ses_kaydi.${ext}`, { type: mimeType });
            
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            fileInput.files = dataTransfer.files;
            
            handleFile(file);
            
            stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorder.start();
        recordStartTime = Date.now();
        
        recordBtn.textContent = i18n[currentLang].stop_record;
        recordBtn.classList.add("recording");
        recordingIndicator.style.display = "inline-block";
        
        recordInterval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - recordStartTime) / 1000);
            const mins = String(Math.floor(elapsed / 60)).padStart(2, "0");
            const secs = String(elapsed % 60).padStart(2, "0");
            recordTime.textContent = `${mins}:${secs}`;
        }, 1000);

    } catch (err) {
        showError(i18n[currentLang].error_mic + err.message);
    }
});

function handleFile(file) {
    selectedFile = file;
    extractBtn.disabled = false;

    const sizeMB = (file.size / 1024 / 1024).toFixed(2);
    fileInfo.textContent = `${file.name} — ${sizeMB} MB`;

    if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
            imagePreview.src = e.target.result;
            imagePreview.style.display = "block";
            audioPreview.style.display = "none";
            audioPreview.src = "";
        };
        reader.readAsDataURL(file);
    } else if (file.type.startsWith("audio/") || file.name.match(/\.(mp3|wav|ogg|m4a|webm|flac)$/i)) {
        const url = URL.createObjectURL(file);
        audioPreview.src = url;
        audioPreview.style.display = "block";
        imagePreview.style.display = "none";
        imagePreview.src = "";
    } else {
        imagePreview.style.display = "none";
        imagePreview.src = "";
        audioPreview.style.display = "none";
        audioPreview.src = "";
    }

    previewSection.style.display = "block";
    hideError();
    resultSection.style.display = "none";
    translationResult.style.display = "none";
}

// OCR işlemi
extractBtn.addEventListener("click", async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("lang", langSelect.value);

    const isAudio = selectedFile.type.startsWith("audio/") || selectedFile.name.match(/\.(mp3|wav|ogg|m4a|webm|flac)$/i);
    const endpoint = isAudio ? "/transcribe" : "/extract";
    const loadingMsg = isAudio ? i18n[currentLang].loading_audio : i18n[currentLang].loading_ocr;

    showLoading(loadingMsg);
    hideError();
    resultSection.style.display = "none";

    try {
        const response = await fetch(endpoint, {
            method: "POST",
            body: formData
        });

        const data = await response.json();

        if (data.success) {
            showResult(data);
        } else {
            showError(data.error || "Bir hata oluştu");
        }
    } catch (err) {
        showError(i18n[currentLang].error_server + err.message);
    } finally {
        hideLoading();
    }
});

// Çeviri işlemi
translateBtn.addEventListener("click", async () => {
    const text = resultText.value;
    if (!text || text === i18n["tr"].no_text || text === i18n["en"].no_text) {
        showError(i18n[currentLang].error_no_text);
        return;
    }

    showLoading(i18n[currentLang].loading_trans);
    hideError();
    translationResult.style.display = "none";

    try {
        const response = await fetch("/translate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                text: text,
                target_lang: targetLang.value
            })
        });

        const data = await response.json();

        if (data.success) {
            translatedText.value = data.translated_text;
            translationMeta.innerHTML = `<span>🌍 ${data.target_lang} ${i18n[currentLang].translated_to}</span>`;
            translationResult.style.display = "block";
        } else {
            showError(data.error || "Çeviri hatası");
        }
    } catch (err) {
        showError(i18n[currentLang].error_server + err.message);
    } finally {
        hideLoading();
    }
});

function showResult(data) {
    resultText.value = data.text || i18n[currentLang].no_text;
    resultMeta.innerHTML = `
        <span>${i18n[currentLang].meta_conf}${data.confidence}</span>
        <span>${i18n[currentLang].meta_lang}${data.language}</span>
        <span>${i18n[currentLang].meta_type}${data.type}</span>
    `;
    resultSection.style.display = "block";
    translationResult.style.display = "none";
}

// Kopyala
copyBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(resultText.value);
    copyBtn.textContent = i18n[currentLang].copied;
    setTimeout(() => copyBtn.textContent = i18n[currentLang].copy_btn, 2000);
});

copyTranslatedBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(translatedText.value);
    copyTranslatedBtn.textContent = i18n[currentLang].copied;
    setTimeout(() => copyTranslatedBtn.textContent = i18n[currentLang].copy_btn, 2000);
});

// İndir
downloadBtn.addEventListener("click", () => downloadTxt(resultText.value, "ocr_sonuc.txt"));
downloadTranslatedBtn.addEventListener("click", () => downloadTxt(translatedText.value, "ceviri_sonuc.txt"));

<<<<<<< HEAD
downloadPdfBtn.addEventListener("click", () => downloadPdf(resultText.value, "ocr_sonuc.pdf"));
downloadTranslatedPdfBtn.addEventListener("click", () => downloadPdf(translatedText.value, "ceviri_sonuc.pdf"));

=======
>>>>>>> e6a7394af1d436c3fc16de8d7ba6b7647b571273
function downloadTxt(content, filename) {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

<<<<<<< HEAD
async function downloadPdf(content, filename) {
    if (!content || content === i18n["tr"].no_text || content === i18n["en"].no_text) {
        showError(i18n[currentLang].error_no_text);
        return;
    }

    showLoading(i18n[currentLang].loading_trans);
    
    try {
        const response = await fetch("/download_pdf", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: content, filename: filename })
        });

        if (response.ok) {
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = filename;
            a.click();
            URL.revokeObjectURL(url);
        } else {
            const data = await response.json();
            showError(data.error || "PDF oluşturma hatası");
        }
    } catch (err) {
        showError(i18n[currentLang].error_server + err.message);
    } finally {
        hideLoading();
    }
}

=======
>>>>>>> e6a7394af1d436c3fc16de8d7ba6b7647b571273
// Temizle
clearBtn.addEventListener("click", () => {
    selectedFile = null;
    fileInput.value = "";
    extractBtn.disabled = true;
    previewSection.style.display = "none";
    resultSection.style.display = "none";
    translationResult.style.display = "none";
    imagePreview.src = "";
    audioPreview.src = "";
    audioPreview.style.display = "none";
    fileInfo.textContent = "";
    hideError();

    if (mediaRecorder && mediaRecorder.state === "recording") {
        mediaRecorder.stop();
    }
});

function showLoading(msg) {
    loadingText.textContent = msg || "İşlem yapılıyor...";
    loading.style.display = "block";
}
function hideLoading() { loading.style.display = "none"; }
function showError(msg) {
    errorMessage.textContent = "❌ " + msg;
    errorSection.style.display = "block";
}
function hideError() { errorSection.style.display = "none"; }
