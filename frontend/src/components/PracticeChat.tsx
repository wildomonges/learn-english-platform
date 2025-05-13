import React, { useState } from 'react';
import '../styles/PracticeChat.css';

interface Line {
  speaker: string;
  textEnglish: string;
  textSpanish: string;
}

interface PracticeChatProps {
  dialog: Line[];
  onBack: () => void;
}

const PracticeChat: React.FC<PracticeChatProps> = ({ dialog, onBack }) => {
  const [currentLine, setCurrentLine] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isListening, setIsListening] = useState(false);

  const current = dialog[currentLine];

  const playAudio = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    speechSynthesis.speak(utterance);
  };

  const handleNext = () => {
    setUserInput('');
    setFeedback('');
    if (currentLine < dialog.length - 1) {
      setCurrentLine(currentLine + 1);
    }
  };

  const handleUserSubmit = () => {
    const expected = current.textEnglish.toLowerCase().replace(/[^\w\s]/gi, '');
    const input = userInput
      .toLowerCase()
      .trim()
      .replace(/[^\w\s]/gi, '');

    if (expected === input) {
      setFeedback('✅ ¡Muy bien! Tu respuesta es correcta.');
    } else {
      setFeedback(`❌ Revisa tu respuesta. Esperado: "${current.textEnglish}"`);
    }
  };

  const handleVoiceInput = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Tu navegador no soporta reconocimiento de voz.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setUserInput(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => {
      alert('Error al capturar la voz');
      setIsListening(false);
    };

    recognition.onend = () => setIsListening(false);

    recognition.start();
    setIsListening(true);
  };

  return (
    <div className='practice-chat'>
      <h2>🧑‍🏫 Práctica de conversación</h2>

      <div className='chat-box'>
        <p>
          <strong>{current.speaker}:</strong>
        </p>
        <p>{current.textEnglish}</p>
        <p>
          <em>{current.textSpanish}</em>
        </p>
      </div>

      <div className='controls'>
        <button onClick={() => playAudio(current.textEnglish)}>
          🔊 Escuchar
        </button>

        {current.speaker === 'Teacher' ? (
          <button onClick={handleNext}>➡️ Siguiente</button>
        ) : (
          <>
            <input
              type='text'
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder='Escribe tu respuesta en inglés...'
            />
            <div className='voice-input'>
              <button onClick={handleVoiceInput}>
                🎤 {isListening ? 'Escuchando...' : 'Hablar'}
              </button>
            </div>
            <button onClick={handleUserSubmit}>Enviar</button>
            {feedback && (
              <p
                className={`feedback ${
                  feedback.startsWith('✅') ? 'success' : 'error'
                }`}
              >
                {feedback}
              </p>
            )}
            {feedback.startsWith('✅') && (
              <button onClick={handleNext}>➡️ Continuar</button>
            )}
          </>
        )}
      </div>

      <button className='back-btn' onClick={onBack}>
        ⬅️ Volver
      </button>
    </div>
  );
};

export default PracticeChat;
