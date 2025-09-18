import '../styles/audio.css';

const SpeechRecognition =
  (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

export const startVoiceRecognition = (
  index: number,
  setUserResponses: React.Dispatch<
    React.SetStateAction<{ [key: number]: string }>
  >,
  setResponseFeedback: React.Dispatch<
    React.SetStateAction<{ [key: number]: string }>
  >,
  setIsRecording: React.Dispatch<React.SetStateAction<boolean>>,
  setRecordingTime: React.Dispatch<React.SetStateAction<number>>
) => {
  if (!SpeechRecognition) {
    alert('Tu navegador no soporta reconocimiento de voz.');
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.continuous = false;
  recognition.maxAlternatives = 1;

  let timer: ReturnType<typeof setInterval> | null = null;

  recognition.onstart = () => {
    setIsRecording(true);
    setRecordingTime(0);
    timer = setInterval(() => setRecordingTime((prev) => prev + 1), 1000);
  };

  recognition.onresult = (event: any) => {
    const transcript = event.results[0][0].transcript;
    setUserResponses((prev) => ({ ...prev, [index]: transcript.trim() }));
  };

  recognition.onerror = (event: any) => {
    setResponseFeedback((prev) => ({
      ...prev,
      [index]: `🎤 Error: ${event.error}`,
    }));
  };

  recognition.onend = () => {
    setIsRecording(false);
    if (timer) clearInterval(timer);
  };

  setUserResponses((prev) => ({ ...prev, [index]: '' }));
  setResponseFeedback((prev) => ({ ...prev, [index]: '' }));
  recognition.start();

  return recognition;
};
