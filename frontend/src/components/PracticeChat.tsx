import React, { useEffect, useState, useRef } from 'react';
import '../styles/PracticeChat.css';
import MicIcon from '@mui/icons-material/Mic';
import SendIcon from '@mui/icons-material/Send';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import { fetchDialog, fetchSpeech } from '../api/speakingAPI';
import CircularProgress from '@mui/material/CircularProgress';
import ProgressBar from './ProgressBar';

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
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const recognitionRef = useRef<any>(null);
  const recordingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalPairs = Math.floor(dialog.length / 2);
  const currentStep = Math.floor(currentPairIndex / 2);

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
    setResponseFeedback((prev) => ({ ...prev, [index]: '' }));
  };

  const handleStartVoiceRecognition = (index: number) => {
    if (!SpeechRecognition) {
      alert('Tu navegador no soporta reconocimiento de voz.');
      return;
    }

    // Clear input and feedback before recording
    setUserResponses((prev) => ({ ...prev, [index]: '' }));
    setResponseFeedback((prev) => ({ ...prev, [index]: '' }));

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsRecording(true);
      setRecordingTime(0);
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setUserResponses((prev) => ({ ...prev, [index]: transcript }));
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
    };

    recognition.onend = () => {
      setIsRecording(false);
      setRecordingTime(0);
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    };

    recognition.start();
    recognitionRef.current = recognition;
  };
  function calculateSimilarity(a: string, b: string): number {
    const normalize = (text: string) =>
      text
        .toLowerCase()
        .replace(/[^\w\s]/gi, '')
        .trim();

    const str1 = normalize(a);
    const str2 = normalize(b);

    const len1 = str1.length;
    const len2 = str2.length;

    const dp = Array.from({ length: len1 + 1 }, () => Array(len2 + 1).fill(0));

    for (let i = 0; i <= len1; i++) dp[i][0] = i;
    for (let j = 0; j <= len2; j++) dp[0][j] = j;

    for (let i = 1; i <= len1; i++) {
      for (let j = 1; j <= len2; j++) {
        if (str1[i - 1] === str2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1];
        } else {
          dp[i][j] =
            1 +
            Math.min(
              dp[i - 1][j], // deletion
              dp[i][j - 1], // insertion
              dp[i - 1][j - 1] // substitution
            );
        }
      }
    }

    const distance = dp[len1][len2];
    const maxLen = Math.max(len1, len2);
    return Math.round(((maxLen - distance) / maxLen) * 100);
  }

  const handleSendResponse = (index: number) => {
    const userResponse = userResponses[index];
    const correctResponse = dialog[index]?.textEnglish;

    const similarity = calculateSimilarity(userResponse, correctResponse);
    if (similarity === 100) {
      setResponseFeedback((prev) => ({
        ...prev,
        [index]: `🎉 ¡Correcto! Coincidencia del 100%. ¡Felicidades!🥳`,
      }));
    } else if (similarity >= 80) {
      setResponseFeedback((prev) => ({
        ...prev,
        [index]: `✅ ¡Muy bien! Coincidencia del ${similarity}%. Pero puedes mejorar!`,
      }));
    } else if (similarity >= 60) {
      setResponseFeedback((prev) => ({
        ...prev,
        [index]: `🟡 Casi lo tienes. Coincidencia del ${similarity}%. Sigue practicando.`,
      }));
    } else {
      setResponseFeedback((prev) => ({
        ...prev,
        [index]: `❌ No fue muy preciso. Coincidencia del ${similarity}%. Intenta de nuevo.`,
      }));
    }
  };

  const goToNextPair = () => setCurrentPairIndex((prev) => prev + 2);
  const goToPreviousPair = () =>
    setCurrentPairIndex((prev) => Math.max(prev - 2, 0));

  const teacherLine = dialog[currentPairIndex];
  const studentLine = dialog[currentPairIndex + 1];

  return (
    <div className={`practice-chat ${loading ? 'loading-state' : ''}`}>
      {loading ? (
        <div className='loading-container'>
          <h2 className='dialog-title'>
            Diálogo: {interest} / {topic}
          </h2>
          <div className='loading-message'>
            🧠 Estamos preparando tu clase... ✍️¡casi listo!☺️
          </div>
          <div className='loading-spinner'>
            <CircularProgress size={40} />
          </div>
        </div>
      ) : (
        <>
          <h2 className='dialog-title'>
            Diálogo: {interest} / {topic}
          </h2>

          {!loading && !error && (
            <ProgressBar current={currentStep} total={totalPairs} />
          )}
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
                  disabled={playingIndex === currentPairIndex}
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
                      handlePlayAudio(
                        studentLine.textEnglish,
                        currentPairIndex + 1
                      )
                    }
                    className='icon-button'
                  >
                    <VolumeUpIcon />
                  </button>

                  <div className='response-row'>
                    <textarea
                      className='response-input'
                      rows={2}
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

                  {isRecording && (
                    <p className='recording-timer'>
                      🎙 Grabando... {recordingTime}s
                    </p>
                  )}

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
        </>
      )}
    </div>
  );
};

export default PracticeChat;
