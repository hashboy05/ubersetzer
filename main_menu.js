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
        translateText();
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