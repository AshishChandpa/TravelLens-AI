// Initialize variables for speech recognition and synthesis
let recognition;
let synth = window.speechSynthesis;
let isListening = false;
let audioContext;
let audioElement;
let isPlaying = false;

// DOM Elements
const micButton = document.getElementById('mic-button');
const micIcon = document.getElementById('mic-icon');
const micText = document.getElementById('mic-text');
const voiceStatus = document.getElementById('voice-status');
const voiceWave = document.getElementById('voice-wave');
const conversationLog = document.getElementById('conversation-log');
const audioControls = document.getElementById('audio-controls');
const pauseButton = document.getElementById('pause-button');
const stopButton = document.getElementById('stop-button');
const audioProgressBar = document.getElementById('audio-progress-bar');

// Check if browser supports speech recognition
function initializeSpeechRecognition() {
    window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (window.SpeechRecognition) {
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        // Initialize event handlers
        setupRecognitionEvents();
        return true;
    } else {
        voiceStatus.innerHTML = '<span class="status-dot"></span><span class="error-message">Speech recognition not supported in this browser</span>';
        voiceStatus.className = 'status-indicator status-error';
        micButton.disabled = true;
        return false;
    }
}

// Setup speech recognition event handlers
function setupRecognitionEvents() {
    recognition.onstart = function () {
        isListening = true;
        micButton.classList.add('listening');
        micIcon.className = 'fas fa-microphone-slash';
        micText.textContent = 'Listening...';
        voiceStatus.innerHTML = '<span class="status-dot"></span><span>Listening...</span>';
        voiceStatus.className = 'status-indicator status-processing';
        voiceWave.classList.add('active');
    };

    recognition.onresult = function (event) {
        const transcript = event.results[0][0].transcript;
        addMessageToConversation('You', transcript, 'user-message');

        // Once we have the transcript, send it to the server
        processUserInput(transcript);
    };

    recognition.onerror = function (event) {
        console.error('Speech recognition error:', event.error);
        isListening = false;
        micButton.classList.remove('listening');
        micIcon.className = 'fas fa-microphone';
        micText.textContent = 'Press to talk';
        voiceStatus.innerHTML = '<span class="status-dot"></span><span class="error-message">Error: ' + event.error + '</span>';
        voiceStatus.className = 'status-indicator status-error';
        voiceWave.classList.remove('active');
    };

    recognition.onend = function () {
        isListening = false;
        micButton.classList.remove('listening');
        micIcon.className = 'fas fa-microphone';
        micText.textContent = 'Press to talk';
        voiceWave.classList.remove('active');
    };
}

// Toggle speech recognition on/off
function toggleSpeechRecognition() {
    if (!recognition) {
        if (!initializeSpeechRecognition()) {
            return;
        }
    }

    if (isListening) {
        recognition.stop();
    } else {
        // Stop any ongoing speech before starting to listen
        if (synth.speaking) {
            synth.cancel();
            audioControls.style.display = 'none';
        }

        recognition.start();
    }
}

// Process user input by sending to the server and getting a response
async function processUserInput(text) {
    voiceStatus.innerHTML = '<span class="status-dot"></span><span>Processing your request...</span>';
    voiceStatus.className = 'status-indicator status-processing';

    try {
        const response = await fetch("/text-to-speech", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text })
        });

        const result = await response.json();

        if (response.ok) {
            const responseText = result.openai_response;
            addMessageToConversation('Guide', responseText, 'assistant-message');

            // Convert response to speech
            // speakText(responseText);

            voiceStatus.innerHTML = '<span class="status-dot"></span><span class="success-message">Response received</span>';
            voiceStatus.className = 'status-indicator status-success';
        } else {
            voiceStatus.innerHTML = '<span class="status-dot"></span><span class="error-message">Error: ' + (result.message || "Failed to process request") + '</span>';
            voiceStatus.className = 'status-indicator status-error';
        }
    } catch (error) {
        voiceStatus.innerHTML = '<span class="status-dot"></span><span class="error-message">Error: ' + error.message + '</span>';
        voiceStatus.className = 'status-indicator status-error';
    }
}

// Add a message to the conversation log
function addMessageToConversation(sender, text, className) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${className}`;

    const labelDiv = document.createElement('div');
    labelDiv.className = 'message-label';
    labelDiv.textContent = sender;

    const textDiv = document.createElement('div');
    textDiv.textContent = text;

    messageDiv.appendChild(labelDiv);
    messageDiv.appendChild(textDiv);

    conversationLog.appendChild(messageDiv);
    conversationLog.scrollTop = conversationLog.scrollHeight;
}

// Speak text using Web Speech API
function speakText(text) {
    if (synth.speaking) {
        synth.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    // Set up audio controls
    setupSpeechEvents(utterance);

    synth.speak(utterance);
    audioControls.style.display = 'flex';
    isPlaying = true;
}

// Set up speech synthesis events
function setupSpeechEvents(utterance) {
    // Update progress bar
    let startTime;
    const totalDuration = estimateSpeechDuration(utterance.text);

    utterance.onstart = function () {
        startTime = Date.now();
        voiceWave.classList.add('active');
        updateAudioControls();
    };

    utterance.onend = function () {
        isPlaying = false;
        voiceWave.classList.remove('active');
        audioControls.style.display = 'none';
        audioProgressBar.style.width = '0%';
    };

    // Set up progress tracking
    function updateAudioControls() {
        if (isPlaying) {
            const elapsed = Date.now() - startTime;
            const progress = Math.min((elapsed / totalDuration) * 100, 100);
            audioProgressBar.style.width = progress + '%';

            if (progress < 100 && synth.speaking) {
                requestAnimationFrame(updateAudioControls);
            }
        }
    }
}

// Estimate speech duration based on word count and average speaking rate
function estimateSpeechDuration(text) {
    // Average English speaking rate is 150 words per minute or 2.5 words per second
    const words = text.split(/\s+/).length;
    const wordsPerSecond = 2.5;
    const durationInSeconds = words / wordsPerSecond;
    return durationInSeconds * 1000; // Convert to milliseconds
}

// Pause/resume speech
function togglePause() {
    if (synth.speaking) {
        if (synth.paused) {
            synth.resume();
            pauseButton.innerHTML = '<i class="fas fa-pause"></i>';
            voiceWave.classList.add('active');
            isPlaying = true;
        } else {
            synth.pause();
            pauseButton.innerHTML = '<i class="fas fa-play"></i>';
            voiceWave.classList.remove('active');
            isPlaying = false;
        }
    }
}

// Stop speech
function stopSpeech() {
    if (synth.speaking) {
        synth.cancel();
        audioControls.style.display = 'none';
        voiceWave.classList.remove('active');
        isPlaying = false;
    }
}

// Initialize event listeners
document.addEventListener('DOMContentLoaded', function () {
    // Initialize speech recognition
    initializeSpeechRecognition();

    // Add event listeners for buttons
    micButton.addEventListener('click', toggleSpeechRecognition);
    pauseButton.addEventListener('click', togglePause);
    stopButton.addEventListener('click', stopSpeech);
    const message_initial = 'Hello! I\'m your virtual travel guide. What would you like to know about?'
    // Add welcome message
    setTimeout(() => {
        addMessageToConversation('Guide', message_initial, 'assistant-message');
    }, 500);
});

// Handle visibility change (pause speech when tab is not visible)
document.addEventListener('visibilitychange', function () {
    if (document.hidden && synth.speaking && !synth.paused) {
        synth.pause();
        pauseButton.innerHTML = '<i class="fas fa-play"></i>';
        voiceWave.classList.remove('active');
    }
});