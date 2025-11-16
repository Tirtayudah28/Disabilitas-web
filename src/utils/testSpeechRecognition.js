// src/utils/testSpeechRecognition.js
export const testSpeechRecognition = () => {
  return new Promise((resolve, reject) => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      reject('Speech Recognition not supported');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'id-ID';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      console.log('✅ TEST SUCCESS - Heard:', transcript);
      resolve(transcript);
    };

    recognition.onerror = (event) => {
      console.error('❌ TEST FAILED - Error:', event.error);
      reject(event.error);
    };

    recognition.onstart = () => {
      console.log('🎤 TEST - Recognition started');
    };

    recognition.onend = () => {
      console.log('🔴 TEST - Recognition ended');
    };

    console.log('🎯 Starting test recognition...');
    recognition.start();

    // Auto timeout after 5 seconds
    setTimeout(() => {
      recognition.stop();
      reject('Timeout - no speech detected');
    }, 5000);
  });
};