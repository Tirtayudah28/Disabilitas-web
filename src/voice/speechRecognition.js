export const createSpeechRecognition = ({
  onStart,
  onEnd,
  onResult,
}) => {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    console.error('Speech Recognition tidak didukung browser');
    return null;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = 'id-ID';
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onstart = () => onStart && onStart();
  recognition.onend = () => onEnd && onEnd();

  recognition.onresult = (event) => {
    const text = event.results[0][0].transcript.toLowerCase();
    onResult && onResult(text);
  };

  recognition.onerror = (e) => {
    console.error('Speech recognition error:', e);
  };

  return recognition;
};
