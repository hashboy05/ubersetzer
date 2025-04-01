let recognition;

// for starting microphone
function startRecognition() {
    if (!('webkitSpeechRecognition' in window)) {
        alert('Speech recognition not supported in this browser.');
        return;
    }

    recognition = new webkitSpeechRecognition();
    recognition.lang = document.getElementById('sourceLang').value;
    recognition.interimResults = false;

    recognition.onstart = function() {
        console.log('Voice recognition started. Speak now.');
    };

    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        document.getElementById('sourceText').value = transcript;
        console.log('You said:', transcript);
    };

    recognition.onerror = function(event) {
        console.error('Error occurred in recognition:', event.error);
    };

    recognition.start();
}

//for stopping microphone
function stopRecognition() {
    if (recognition) {
        recognition.stop();
        console.log('Voice recognition stopped.');
    }
    translateText();
}

//for translating input text to output text
async function translateText() {
    const sourceText = document.getElementById('sourceText').value;
    const sourceLang = document.getElementById('sourceLang').value;
    const targetLang = document.getElementById('targetLang').value;
    const translatedText = document.getElementById('translatedText');

    if (!sourceText) {
        translatedText.value = '';
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                text: sourceText,
                source_lang: sourceLang === 'auto' ? 'auto' : sourceLang,
                target_lang: targetLang
            })
        });

        const data = await response.json();
        if (data.status === 'success') {
            translatedText.value = data.translation;
        } else {
            throw new Error(data.error);
        }
    } catch (error) {
        alert(`Translation failed: ${error.message}`);
        translatedText.value = '';
    }
}

window.onload = () => {
    document.getElementById('sourceText').addEventListener('input', translateText);
};

//for swapping input and output languages
function swapLanguages() {
    const sourceLang = document.getElementById('sourceLang');
    const targetLang = document.getElementById('targetLang');
    const sourceText = document.getElementById('sourceText').value;
    const translatedText = document.getElementById('translatedText').value;

    // Swap language values
    [sourceLang.value, targetLang.value] = [targetLang.value, sourceLang.value];
    
    // Swap text content
    document.getElementById('sourceText').value = translatedText;
    document.getElementById('translatedText').value = sourceText;
}

//for copying the output translation
function copyTranslation() {
    const translatedText = document.getElementById('translatedText');
    translatedText.select();
    document.execCommand('copy');
    alert('Translation copied to clipboard!');
}

//for clearing the input and output translation
function clearText() {
    document.getElementById('sourceText').value = '';
    document.getElementById('translatedText').value = '';
}

//for reading out the translation, also useful for blind people
function readTranslation() {
    const translatedText = document.getElementById('translatedText').value;

    if (!translatedText) {
        alert('No translation available to read.');
        return;
    }

    // Create a new speech synthesis utterance
    const utterance = new SpeechSynthesisUtterance(translatedText);

    // Set voice properties (optional)
    utterance.lang = document.getElementById('targetLang').value; // Use the target language for speech
    utterance.rate = 1; // Normal speaking rate
    utterance.pitch = 1; // Normal pitch

    // Speak the text
    window.speechSynthesis.speak(utterance);
}