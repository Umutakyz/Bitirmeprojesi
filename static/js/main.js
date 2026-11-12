const i18n = {
    tr: {
        title: "📄 OCR & Ses Metin Çıkarma",
        subtitle: "Fotoğraf, PDF veya Ses dosyası yükle, metni anında çıkar ve çevir",
        dropzone_title: "Dosyayı buraya sürükle veya tıkla",
        dropzone_desc: "PNG, JPG, PDF, MP3, WAV, vb. — Max 512MB",
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
        about_me: "Ben Umut Ferhat Akyüz. Igor Sikorsky Kyiv Politeknik Enstitüsü'nde 4. sınıf öğrencisiyim. Bu benim bitirme projemdir.",
        phase_queued: "Sırada bekliyor...",
        phase_loading_model: "Model yükleniyor (ilk seferde indirilebilir, birkaç dakika sürebilir)...",
        phase_transcribing: "Ses metne çevriliyor... %",
        progress_hint: "Sekmeyi kapatabilirsin; işlem arka planda sürer, sonuç Geçmiş'e kaydedilir.",
        timestamps_toggle: "Zaman damgalarını göster",
        meta_duration: "⏱️ Süre: ",
        history_title: "🗂️ Geçmiş",
        history_empty: "Henüz kayıt yok.",
        open_btn: "Aç",
        delete_btn: "Sil",
        delete_confirm: "Bu kayıt silinsin mi?"
    },
    en: {
        title: "📄 OCR & Audio Transcription",
        subtitle: "Upload a Photo, PDF or Audio file to extract instantly and translate",
        dropzone_title: "Drag and drop the file here or click",
        dropzone_desc: "PNG, JPG, PDF, MP3, WAV, etc. — Max 512MB",
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
        about_me: "I am Umut Ferhat Akyüz. I am a 4th-year student at Igor Sikorsky Kyiv Polytechnic Institute. This is my graduation project.",
        phase_queued: "Waiting in queue...",
        phase_loading_model: "Loading model (may download on first use, can take a few minutes)...",
        phase_transcribing: "Transcribing audio... %",
        progress_hint: "You can close the tab; the job keeps running and the result is saved to History.",
        timestamps_toggle: "Show timestamps",
        meta_duration: "⏱️ Duration: ",
        history_title: "🗂️ History",
        history_empty: "No records yet.",
        open_btn: "Open",
        delete_btn: "Delete",
        delete_confirm: "Delete this record?"
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

const progress = document.getElementById("progress");
const progressBar = document.getElementById("progressBar");
const progressHint = document.getElementById("progressHint");
const timestampToggle = document.getElementById("timestampToggle");
const timestampCheck = document.getElementById("timestampCheck");
const historyList = document.getElementById("historyList");
const historyEmpty = document.getElementById("historyEmpty");

let selectedFile = null;
let currentResult = null;   // son gösterilen sonuç (düz + zaman damgalı metin)
let historyItems = [];
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
    renderHistory();
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
            showLoading(false);
        } else if (data.job_id) {
            // Ses: arka plan işi, ilerlemeyi izle
            pollJob(data.job_id);
        } else {
            showResult(data);
            showLoading(false);
            loadHistory();
        }
    } catch (err) {
        showError(i18n[currentLang].error_server + err.message);
        showLoading(false);
    }
});

// Sonucu göster
function showResult(data) {
    currentResult = data;
    const hasStamps = !!data.text_timestamped;
    timestampToggle.style.display = hasStamps ? "inline-flex" : "none";
    renderResultText();

    const duration = data.duration ? `<span>${i18n[currentLang].meta_duration} ${formatDuration(data.duration)}</span>` : "";
    resultMeta.innerHTML = `
        <span>${i18n[currentLang].meta_type} ${String(data.type).toUpperCase()}</span>
        <span>${i18n[currentLang].meta_lang} ${String(data.language).toUpperCase()}</span>
        ${duration}
    `;
    resultSection.style.display = "block";
    translationResult.style.display = "none";
    resultSection.scrollIntoView({ behavior: "smooth" });
}

function renderResultText() {
    if (!currentResult) return;
    const useStamps = timestampCheck.checked && currentResult.text_timestamped;
    resultText.value = (useStamps ? currentResult.text_timestamped : currentResult.text) || i18n[currentLang].no_text;
}

timestampCheck.addEventListener("change", renderResultText);

function formatDuration(sec) {
    sec = Math.round(sec);
    const h = Math.floor(sec / 3600), m = Math.floor(sec % 3600 / 60), s = sec % 60;
    return h ? `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}` : `${m}:${String(s).padStart(2, "0")}`;
}

// Arka plan işini izle
function pollJob(jobId) {
    localStorage.setItem("activeJob", jobId);
    showLoading(true);
    progress.style.display = "block";
    progressHint.style.display = "block";

    const finish = () => {
        localStorage.removeItem("activeJob");
        progress.style.display = "none";
        progressHint.style.display = "none";
        showLoading(false);
    };

    const tick = async () => {
        let job;
        try {
            const response = await fetch(`/jobs/${jobId}`);
            if (response.status === 404) {
                finish();
                showError((await response.json()).error);
                return;
            }
            job = await response.json();
        } catch (err) {
            setTimeout(tick, 5000);  // sunucuya geçici ulaşılamadı, tekrar dene
            return;
        }

        if (job.status === "done") {
            finish();
            const record = await (await fetch(`/history/${job.result_id}`)).json();
            showResult(record);
            loadHistory();
            return;
        }
        if (job.status === "error") {
            finish();
            showError(job.error);
            return;
        }

        const t = i18n[currentLang];
        if (job.phase === "transcribing") {
            loadingText.innerText = `${t.phase_transcribing}${Math.floor(job.progress)}`;
            progress.classList.remove("indeterminate");
            progressBar.style.width = `${job.progress}%`;
        } else {
            loadingText.innerText = job.phase === "queued" ? t.phase_queued : t.phase_loading_model;
            progress.classList.add("indeterminate");
            progressBar.style.width = "";
        }
        setTimeout(tick, 2000);
    };
    tick();
}

// Geçmiş
async function loadHistory() {
    try {
        historyItems = (await (await fetch("/history")).json()).items;
    } catch (err) {
        historyItems = [];
    }
    renderHistory();
}

function renderHistory() {
    historyList.innerHTML = "";
    historyEmpty.style.display = historyItems.length ? "none" : "block";
    const t = i18n[currentLang];

    historyItems.forEach(item => {
        const li = document.createElement("li");
        li.className = "history-item";

        const info = document.createElement("div");
        info.className = "history-info";
        const name = document.createElement("div");
        name.className = "history-name";
        name.textContent = item.filename;  // textContent: dosya adı HTML olarak yorumlanmaz
        const meta = document.createElement("div");
        meta.className = "history-meta";
        const date = new Date(item.created * 1000).toLocaleString(currentLang === "tr" ? "tr-TR" : "en-GB");
        meta.textContent = [date, item.duration ? formatDuration(item.duration) : null, `${item.chars} ${currentLang === "tr" ? "karakter" : "chars"}`]
            .filter(Boolean).join(" · ");
        info.append(name, meta);

        const actions = document.createElement("div");
        actions.className = "history-actions";
        const openBtn = document.createElement("button");
        openBtn.textContent = t.open_btn;
        openBtn.addEventListener("click", async () => {
            const response = await fetch(`/history/${item.id}`);
            if (response.ok) showResult(await response.json());
        });
        const delBtn = document.createElement("button");
        delBtn.textContent = t.delete_btn;
        delBtn.addEventListener("click", async () => {
            if (!confirm(t.delete_confirm)) return;
            await fetch(`/history/${item.id}`, { method: "DELETE" });
            loadHistory();
        });
        actions.append(openBtn, delBtn);

        li.append(info, actions);
        historyList.appendChild(li);
    });
}

// Çevir
translateBtn.addEventListener("click", async () => {
    const text = (currentResult && currentResult.text) || resultText.value;
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
    currentResult = null;
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
loadHistory();
// Sayfa yenilendiyse devam eden ses işini yakala
const activeJob = localStorage.getItem("activeJob");
if (activeJob) pollJob(activeJob);
