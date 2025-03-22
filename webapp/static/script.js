
// File input handling
const fileInput = document.getElementById("stt-file");
const fileNameDisplay = document.getElementById("file-name-display");
const sttButton = document.getElementById("stt-button");

fileInput.addEventListener("change", function () {
    if (this.files.length > 0) {
        const fileName = this.files[0].name;
        fileNameDisplay.textContent = `Selected file: ${fileName}`;
        fileNameDisplay.style.marginBottom = "15px";
        sttButton.disabled = false;
    } else {
        fileNameDisplay.textContent = "";
        sttButton.disabled = true;
    }
});

// Text-to-Speechl̥
async function convertTextToSpeech() {
    const text = document.getElementById("tts-text").value.trim();
    const ttsButton = document.getElementById("tts-button");
    const ttsLoader = document.getElementById("tts-loader");
    const ttsResult = document.getElementById("tts-result");
    const ttsStatus = document.getElementById("tts-status");

    if (!text) {
        ttsStatus.innerHTML = '<span class="status-dot"></span><span class="error-message">Please enter some text</span>';
        ttsStatus.className = 'status-indicator status-error';
        return;
    }

    // Show loading state
    ttsButton.disabled = true;
    ttsLoader.style.display = "inline-block";
    ttsResult.textContent = "";
    ttsStatus.innerHTML = '<span class="status-dot"></span><span>Processing...</span>';
    ttsStatus.className = 'status-indicator status-processing';

    try {
        const response = await fetch("/text-to-speech", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text })
        });

        const result = await response.json();

        if (response.ok) {
            // Create an audio element to play the speech
            const audioElement = document.createElement("audio");
            audioElement.controls = true;
            audioElement.src = result.audioUrl || "data:audio/mp3;base64," + result.audioBase64;
            audioElement.style.width = "100%";
            audioElement.style.marginTop = "10px";

            ttsResult.innerHTML = '';
            ttsResult.appendChild(audioElement);

            ttsStatus.innerHTML = '<span class="status-dot"></span><span class="success-message">Conversion successful!</span>';
            ttsStatus.className = 'status-indicator status-success';
        } else {
            ttsResult.textContent = result.message || "Failed to convert text to speech.";
            ttsStatus.innerHTML = '<span class="status-dot"></span><span class="error-message">Error: ' + (result.message || "Failed to convert") + '</span>';
            ttsStatus.className = 'status-indicator status-error';
        }
    } catch (error) {
        ttsResult.textContent = "An error occurred. Please try again.";
        ttsStatus.innerHTML = '<span class="status-dot"></span><span class="error-message">Error: ' + error.message + '</span>';
        ttsStatus.className = 'status-indicator status-error';
    } finally {
        // Hide loading state
        ttsButton.disabled = false;
        ttsLoader.style.display = "none";
    }
}

// Speech-to-Text
async function convertSpeechToText() {
    const fileInput = document.getElementById("stt-file");
    const sttButton = document.getElementById("stt-button");
    const sttLoader = document.getElementById("stt-loader");
    const sttResult = document.getElementById("stt-result");
    const sttStatus = document.getElementById("stt-status");

    if (!fileInput.files.length) {
        sttStatus.innerHTML = '<span class="status-dot"></span><span class="error-message">Please select an audio file</span>';
        sttStatus.className = 'status-indicator status-error';
        return;
    }

    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append("file", file);

    // Show loading state
    sttButton.disabled = true;
    sttLoader.style.display = "inline-block";
    sttResult.textContent = "";
    sttStatus.innerHTML = '<span class="status-dot"></span><span>Processing audio...</span>';
    sttStatus.className = 'status-indicator status-processing';

    try {
        const response = await fetch("/speech-to-text", {
            method: "POST",
            body: formData
        });

        const result = await response.json();

        if (response.ok) {
            sttResult.textContent = result.text;
            sttStatus.innerHTML = '<span class="status-dot"></span><span class="success-message">Transcription complete!</span>';
            sttStatus.className = 'status-indicator status-success';
        } else {
            sttResult.textContent = result.message || "Failed to convert speech to text.";
            sttStatus.innerHTML = '<span class="status-dot"></span><span class="error-message">Error: ' + (result.message || "Failed to convert") + '</span>';
            sttStatus.className = 'status-indicator status-error';
        }
    } catch (error) {
        sttResult.textContent = "An error occurred. Please try again.";
        sttStatus.innerHTML = '<span class="status-dot"></span><span class="error-message">Error: ' + error.message + '</span>';
        sttStatus.className = 'status-indicator status-error';
    } finally {
        // Hide loading state
        sttButton.disabled = false;
        sttLoader.style.display = "none";
    }
}

// Keyboard shortcut support
document.addEventListener('keydown', function (event) {
    // Ctrl+Enter or Cmd+Enter to convert text to speech
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter' && document.activeElement === document.getElementById('tts-text')) {
        event.preventDefault();
        convertTextToSpeech();
    }
});