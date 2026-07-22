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
        translated_to: "diline çevrildi",
        pdf_btn: "📕 PDF İndir",
        lang_de: "🇩🇪 Almanca",
        lang_fr: "🇫🇷 Fransızca",
        lang_es: "🇪🇸 İspanyolca",
        lang_ru: "🇷🇺 Rusça",
        lang_ar: "🇸🇦 Arapça",
        footer_text: "Mezuniyet Projesi",
        about_me: "Ben Umut Ferhat Akyüz. Igor Sikorsky Kyiv Politeknik Enstitüsü'nde 4. sınıf öğrencisiyim. Bu benim bitirme projemdir."
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
        translated_to: "translated to",
        pdf_btn: "📕 Download PDF",
        lang_de: "🇩🇪 German",
        lang_fr: "🇫🇷 French",
        lang_es: "🇪🇸 Spanish",
        lang_ru: "🇷🇺 Russian",
        lang_ar: "🇸🇦 Arabic",
        footer_text: "Graduation Project",
        about_me: "I am Umut Ferhat Akyüz. I am a 4th-year student at Igor Sikorsky Kyiv Polytechnic Institute. This is my graduation project."
    }
};

let currentLang = "tr";

// DOM Elements
const dropZone = document.getElementById("dropZone");
const fileInput = document.getElementById("fileInput");
const extractBtn = document.getElementById("extractBtn");
const loading = document.getElementById("loading");
const loadingText = document.getElementById("loadingText");
const resultSection = document.getElementById("resultSection");
const resultText = document.getElementById("resultText");
const resultMeta = document.getElementById("resultMeta");
const copyBtn = document.getElementById("copyBtn");
const downloadBtn = document.getElementById("downloadBtn");
const clearBtn = document.getElementById("clearBtn");
const errorSection = document.getElementById("errorSection");
const errorMessage = document.getElementById("errorMessage");
const previewSection = document.getElementById("previewSection");
const imagePreview = document.getElementById("imagePreview");
const audioPreview = document.getElementById("audioPreview");
const fileInfo = document.getElementById("fileInfo");
const langSelect = document.getElementById("langSelect");
const targetLang = document.getElementById("targetLang");
const translateBtn = document.getElementById("translateBtn");
const translatedText = document.getElementById("translatedText");
const translationResult = document.getElementById("translationResult");
const translationMeta = document.getElementById("translationMeta");
const copyTranslatedBtn = document.getElementById("copyTranslatedBtn");
const downloadTranslatedBtn = document.getElementById("downloadTranslatedBtn");
const langToggleBtn = document.getElementById("langToggleBtn");
const recordBtn = document.getElementById("recordBtn");
const recordingIndicator = document.getElementById("recordingIndicator");
const recordTime = document.getElementById("recordTime");
const downloadPdfBtn = document.getElementById("downloadPdfBtn");
const downloadTranslatedPdfBtn = document.getElementById("downloadTranslatedPdfBtn");

let selectedFile = null;
let mediaRecorder;
let audioChunks = [];
let startTime;
let timerInterval;

// Dil Değiştirme
langToggleBtn.addEventListener("click", () => {
    currentLang = currentLang === "tr" ? "en" : "tr";
    updateUI();
});

function updateUI() {
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        if (i18n[currentLang][key]) {
            if (el.tagName === "OPTION") {
                el.text = i18n[currentLang][key];
            } else {
                el.innerText = i18n[currentLang][key];
            }
        }
    });
    langToggleBtn.innerText = currentLang === "tr" ? "🇬🇧 Switch to English" : "🇹🇷 Türkçe'ye Geç";
    
    // Placeholderları güncelle (eğer varsa)
    resultText.placeholder = i18n[currentLang].no_text;
    translatedText.placeholder = i18n[currentLang].no_text;
}

// Dosya Seçme
dropZone.addEventListener("click", () => fileInput.click());

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
    if (e.dataTransfer.files.length) {
        handleFile(e.dataTransfer.files[0]);
    }
});

fileInput.addEventListener("change", (e) => {
    if (e.target.files.length) {
        handleFile(e.target.files[0]);
    }
});

function handleFile(file) {
    selectedFile = file;
    extractBtn.disabled = false;
    errorSection.style.display = "none";
    
    // Önizleme
    previewSection.style.display = "block";
    fileInfo.innerText = `${file.name} — ${(file.size / (1024 * 1024)).toFixed(2)} MB`;
    
    if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
            imagePreview.src = e.target.result;
            imagePreview.style.display = "block";
            audioPreview.style.display = "none";
        };
        reader.readAsDataURL(file);
    } else if (file.type.startsWith("audio/")) {
        const url = URL.createObjectURL(file);
        audioPreview.src = url;
        audioPreview.style.display = "block";
        imagePreview.style.display = "none";
    } else {
        imagePreview.style.display = "none";
        audioPreview.style.display = "none";
    }
}

// Ses Kaydı
recordBtn.addEventListener("click", async () => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
        mediaRecorder.stop();
        recordBtn.innerText = i18n[currentLang].record_btn;
        recordingIndicator.style.display = "none";
        clearInterval(timerInterval);
        return;
    }

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        audioChunks = [];

        mediaRecorder.ondataavailable = (e) => audioChunks.push(e.data);
        mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
            const file = new File([audioBlob], "recorded_audio.wav", { type: "audio/wav" });
            handleFile(file);
            stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorder.start();
        recordBtn.innerText = i18n[currentLang].stop_record;
        recordingIndicator.style.display = "inline";
        startTime = Date.now();
        updateTimer();
        timerInterval = setInterval(updateTimer, 1000);
    } catch (err) {
        showError(i18n[currentLang].error_mic + err.message);
    }
});

function updateTimer() {
    const diff = Math.floor((Date.now() - startTime) / 1000);
    const m = Math.floor(diff / 60).toString().padStart(2, "0");
    const s = (diff % 60).toString().padStart(2, "0");
    recordTime.innerText = `${m}:${s}`;
}

// Metin Çıkar
extractBtn.addEventListener("click", async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("lang", langSelect.value);

    const isAudio = selectedFile.type.startsWith("audio/") || selectedFile.name.endsWith(".wav");
    loadingText.innerText = isAudio ? i18n[currentLang].loading_audio : i18n[currentLang].loading_ocr;
    
    showLoading(true);
    resultSection.style.display = "none";
    errorSection.style.display = "none";
    translationResult.style.display = "none";

    try {
        const response = await fetch("/extract", {
            method: "POST",
            body: formData
        });
        const data = await response.json();

        if (data.error) {
            showError(data.error);
        } else {
            resultText.value = data.text || i18n[currentLang].no_text;
            resultMeta.innerHTML = `
                <span>${i18n[currentLang].meta_type} ${data.type.toUpperCase()}</span>
                <span>${i18n[currentLang].meta_lang} ${data.language.toUpperCase()}</span>
            `;
            resultSection.style.display = "block";
            resultSection.scrollIntoView({ behavior: "smooth" });
        }
    } catch (err) {
        showError(i18n[currentLang].error_server + err.message);
    } finally {
        showLoading(false);
    }
});

// Çevir
translateBtn.addEventListener("click", async () => {
    const text = resultText.value;
    if (!text || text === i18n[currentLang].no_text) {
        showError(i18n[currentLang].error_no_text);
        return;
    }

    const target = targetLang.value;
    loadingText.innerText = i18n[currentLang].loading_trans;
    showLoading(true);

    try {
        const response = await fetch("/translate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text, target_lang: target })
        });
        const data = await response.json();

        if (data.error) {
            showError(data.error);
        } else {
            translatedText.value = data.translated_text;
            const targetName = targetLang.options[targetLang.selectedIndex].text;
            translationMeta.innerHTML = `<span>${targetName} ${i18n[currentLang].translated_to}</span>`;
            translationResult.style.display = "block";
            translationResult.scrollIntoView({ behavior: "smooth" });
        }
    } catch (err) {
        showError(i18n[currentLang].error_server + err.message);
    } finally {
        showLoading(false);
    }
});

// Kopyala
copyBtn.addEventListener("click", () => copyToClipboard(resultText.value, copyBtn));
copyTranslatedBtn.addEventListener("click", () => copyToClipboard(translatedText.value, copyTranslatedBtn));

function copyToClipboard(text, btn) {
    navigator.clipboard.writeText(text).then(() => {
        const originalText = btn.innerText;
        btn.innerText = i18n[currentLang].copied;
        setTimeout(() => btn.innerText = originalText, 2000);
    });
}

// İndir
downloadBtn.addEventListener("click", () => downloadTxt(resultText.value, "ocr_sonuc.txt"));
downloadTranslatedBtn.addEventListener("click", () => downloadTxt(translatedText.value, "ceviri_sonuc.txt"));

downloadPdfBtn.addEventListener("click", () => downloadPdf(resultText.value, "ocr_sonuc.pdf"));
downloadTranslatedPdfBtn.addEventListener("click", () => downloadPdf(translatedText.value, "ceviri_sonuc.pdf"));

function downloadTxt(content, filename) {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

async function downloadPdf(content, filename) {
    if (!content || content === i18n["tr"].no_text || content === i18n["en"].no_text) {
        showError(i18n[currentLang].error_no_text);
        return;
    }

    loadingText.innerText = i18n[currentLang].loading_trans;
    showLoading(true);
    
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
        showLoading(false);
    }
}

// Temizle
clearBtn.addEventListener("click", () => {
    selectedFile = null;
    fileInput.value = "";
    resultText.value = "";
    translatedText.value = "";
    resultSection.style.display = "none";
    previewSection.style.display = "none";
    extractBtn.disabled = true;
});

// Helper Functions
function showLoading(show) {
    loading.style.display = show ? "block" : "none";
    extractBtn.disabled = show;
}

function showError(msg) {
    errorMessage.innerText = msg;
    errorSection.style.display = "block";
    errorSection.scrollIntoView({ behavior: "smooth" });
}

// Init
updateUI();
