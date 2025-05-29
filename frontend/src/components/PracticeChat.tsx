import React, { useEffect, useState, useRef } from 'react';
import '../styles/PracticeChat.css';
import MicIcon from '@mui/icons-material/Mic';
import SendIcon from '@mui/icons-material/Send';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import { fetchDialog, fetchSpeech } from '../api/speakingAPI';
import CircularProgress from '@mui/material/CircularProgress';

const SpeechRecognition =
  (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

type DialogLine = {
  speaker: string;
  textEnglish: string;
  textSpanish: string;
};

type Props = {
  topic: string;
  interest: string;
  onBack: () => void;
};

const PracticeChat: React.FC<Props> = ({ topic, interest, onBack }) => {
  const [dialog, setDialog] = useState<DialogLine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const [userResponses, setUserResponses] = useState<{ [key: number]: string }>(
    {}
  );
  const [responseFeedback, setResponseFeedback] = useState<{
    [key: number]: string;
  }>({});
  const [currentPairIndex, setCurrentPairIndex] = useState(0);
  const recognitionRef = useRef<any>(null);

  const loadDialog = async () => {
    setLoading(true);
    try {
      const data = await fetchDialog(topic, interest);
      setDialog(data.dialog || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching dialog:', err);
      setError('Failed to fetch dialogue. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDialog();
  }, [topic, interest]);

  const isSimilarAnswer = (userInput: string, expected: string): boolean => {
    const normalize = (text: string) =>
      text
        .toLowerCase()
        .replace(/[^\w\s]/gi, '')
        .trim();
    return normalize(userInput) === normalize(expected);
  };

  const handlePlayAudio = async (text: string, index: number) => {
    setPlayingIndex(index);
    try {
      const data = await fetchSpeech(text);
      const audioBlob = new Blob(
        [Uint8Array.from(atob(data.audio), (c) => c.charCodeAt(0))],
        { type: 'audio/mp3' }
      );
      const audioUrl = URL.createObjectURL(audioBlob);
      new Audio(audioUrl).play();
    } catch (err) {
      console.error('Error playing audio:', err);
    } finally {
      setPlayingIndex(null);
    }
  };

  const handleTextResponseChange = (index: number, value: string) => {
    setUserResponses((prev) => ({ ...prev, [index]: value }));
  };

  const handleStartVoiceRecognition = (index: number) => {
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
      setUserResponses((prev) => ({ ...prev, [index]: transcript }));
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  const handleSendResponse = (index: number) => {
    const userResponse = userResponses[index];
    const correctResponse = dialog[index]?.textEnglish;

    if (isSimilarAnswer(userResponse, correctResponse)) {
      setResponseFeedback((prev) => ({ ...prev, [index]: '✅ ¡Correcto!' }));
    } else {
      setResponseFeedback((prev) => ({
        ...prev,
        [index]: `❌ 🥲 Incorrecto. Respuesta esperada: "${correctResponse}"`,
      }));
    }
  };

  const goToNextPair = () => {
    setCurrentPairIndex((prev) => prev + 2);
  };

  const goToPreviousPair = () => {
    setCurrentPairIndex((prev) => Math.max(prev - 2, 0));
  };

  const teacherLine = dialog[currentPairIndex];
  const studentLine = dialog[currentPairIndex + 1];

  return (
    <div className={`practice-chat ${loading ? 'loading-state' : ''}`}>
      <h2 className='dialog-title'>
        Diálogo: {interest} / {topic}
      </h2>

      {loading && (
        <div className='loading-spinner'>
          <CircularProgress size={40} />
        </div>
      )}

      {error && <p className='error'>{error}</p>}

      {!loading && !error && teacherLine && (
        <div className='dialog-pair'>
          <div className='chat-bubble teacher'>
            <strong>Teacher:</strong>
            <p>{teacherLine.textEnglish}</p>
            <p className='text-spanish'>({teacherLine.textSpanish})</p>
            <button
              onClick={() =>
                handlePlayAudio(teacherLine.textEnglish, currentPairIndex)
              }
              className='icon-button'
            >
              <VolumeUpIcon />
            </button>
          </div>

          {studentLine && (
            <div className='chat-bubble student'>
              <strong>Student:</strong>
              <p>{studentLine.textEnglish}</p>
              <p className='text-spanish'>({studentLine.textSpanish})</p>
              <button
                onClick={() =>
                  handlePlayAudio(studentLine.textEnglish, currentPairIndex + 1)
                }
                className='icon-button'
              >
                <VolumeUpIcon />
              </button>

              <div className='response-row'>
                <input
                  type='text'
                  className='response-input'
                  placeholder='Tu respuesta...'
                  value={userResponses[currentPairIndex + 1] || ''}
                  onChange={(e) =>
                    handleTextResponseChange(
                      currentPairIndex + 1,
                      e.target.value
                    )
                  }
                />
                <button
                  onClick={() =>
                    handleStartVoiceRecognition(currentPairIndex + 1)
                  }
                  className='icon-button'
                >
                  <MicIcon />
                </button>
                <button
                  onClick={() => handleSendResponse(currentPairIndex + 1)}
                  className='icon-button'
                >
                  <SendIcon />
                </button>
              </div>

              {responseFeedback[currentPairIndex + 1] && (
                <p className='feedback'>
                  {responseFeedback[currentPairIndex + 1]}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {!loading && (
        <div className='navigation-buttons'>
          {currentPairIndex > 0 ? (
            <button onClick={goToPreviousPair}>⬅ Back</button>
          ) : (
            <button onClick={onBack}>⬅ Volver al inicio</button>
          )}
          {currentPairIndex + 2 < dialog.length && (
            <button onClick={goToNextPair}>Next ➡</button>
          )}
        </div>
      )}
    </div>
  );
};

export default PracticeChat;
