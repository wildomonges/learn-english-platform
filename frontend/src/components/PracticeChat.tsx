import React, { useEffect, useState, useRef } from 'react';
import '../styles/PracticeChat.css';
import MicIcon from '@mui/icons-material/Mic';
import SendIcon from '@mui/icons-material/Send';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import { fetchDialog, fetchSpeech } from '../api/speakingAPI';
import CircularProgress from '@mui/material/CircularProgress';
import ProgressBar from './ProgressBar';
import MoreVertIcon from '@mui/icons-material/MoreVert'; // Tres puntitos

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

interface User {
  firstName: string;
  lastName: string;
  email: string;
}

const PracticeChat: React.FC<Props> = ({ topic, interest, onBack }) => {
  const [user, setUser] = useState<User | null>(null);
  const [dialog, setDialog] = useState<DialogLine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const [userResponses, setUserResponses] = useState<{ [key: number]: string }>(
    {}
  );
  const [preferredSpeed, setPreferredSpeed] = useState<number>(1);

  const [responseFeedback, setResponseFeedback] = useState<{
    [key: number]: string;
  }>({});
  const [currentPairIndex, setCurrentPairIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  const recognitionRef = useRef<any>(null);
  const recordingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const totalPairs = Math.floor(dialog.length / 2);
  const currentStep = Math.floor(currentPairIndex / 2);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [playbackTarget, setPlaybackTarget] = useState<{
    text: string;
    index: number;
  } | null>(null);

  const handleOpenSpeedMenu = (
    event: React.MouseEvent<HTMLElement>,
    text: string,
    index: number
  ) => {
    setAnchorEl(event.currentTarget);
    setPlaybackTarget({ text, index });
  };

  const handleCloseSpeedMenu = () => {
    setAnchorEl(null);
    setPlaybackTarget(null);
  };

  const handleSelectSpeed = (speed: number) => {
    setPreferredSpeed(speed);
    if (playbackTarget) {
      handlePlayAudio(playbackTarget.text, playbackTarget.index, speed);
    }
    handleCloseSpeedMenu();
  };

  useEffect(() => {
    try {
      const userData = localStorage.getItem('user');
      if (!userData) return;
      const parsedUser: User = JSON.parse(userData);
      if (!parsedUser.firstName || !parsedUser.email) return;
      setUser(parsedUser);
    } catch (error) {
      console.error('Error parsing user data:', error);
      localStorage.removeItem('user');
    }

    const loadDialog = async () => {
      setLoading(true);
      try {
        const data = await fetchDialog(topic, interest);
        setDialog(data.dialog || []);
      } catch (err) {
        console.error('Error fetching dialog:', err);
        setError('Failed to fetch dialogue. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadDialog();
  }, [topic, interest]);

  const handlePlayAudio = async (
    text: string,
    index: number,
    rate: number = 1
  ) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    setPlayingIndex(index);
    try {
      const data = await fetchSpeech(text);
      const audioBlob = new Blob(
        [Uint8Array.from(atob(data.audio), (c) => c.charCodeAt(0))],
        { type: 'audio/mp3' }
      );
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      audio.playbackRate = rate;
      audio.play();
      audio.onended = () => setPlayingIndex(null);
    } catch (err) {
      console.error('Error playing audio:', err);
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

    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.continuous = false;
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
      setUserResponses((prev) => ({
        ...prev,
        [index]: transcript.trim(), // limpio y directo
      }));
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setError(`🎤 Error: ${event.error}`);
    };

    recognition.onend = () => {
      setIsRecording(false);
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }
    };

    recognitionRef.current = recognition;

    setUserResponses((prev) => ({ ...prev, [index]: '' }));
    setResponseFeedback((prev) => ({ ...prev, [index]: '' }));

    recognition.start();
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
          dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
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

    let feedback = '';
    if (similarity === 100) {
      feedback = `🎉 ¡Correcto! Coincidencia del 100%. ¡Felicidades!🥳`;
    } else if (similarity >= 80) {
      feedback = `✅ ¡Muy bien! Coincidencia del ${similarity}%. Pero puedes mejorar!`;
    } else if (similarity >= 60) {
      feedback = `🟡 Casi lo tienes. Coincidencia del ${similarity}%. Sigue practicando.`;
    } else {
      feedback = `❌ No fue muy preciso. Coincidencia del ${similarity}%. Intenta de nuevo.`;
    }
    setResponseFeedback((prev) => ({ ...prev, [index]: feedback }));
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

          {user && (
            <p className='greeting-message'>👋 ¡Hola, {user.firstName}!</p>
          )}

          {!loading && !error && (
            <ProgressBar current={currentStep} total={totalPairs} />
          )}
          {error && <p className='error'>{error}</p>}

          {!loading && !error && teacherLine && (
            <div className='dialog-pair'>
              <div className='chat-bubble teacher'>
                <strong>Teacher:</strong>
                <p>{teacherLine.textEnglish}</p>
                <p className='text-spanish'>({teacherLine.textSpanish})</p>
                {/* 🔊 Reproduce directamente a velocidad normal */}
                <button
                  onClick={() =>
                    handlePlayAudio(
                      teacherLine.textEnglish,
                      currentPairIndex,
                      preferredSpeed
                    )
                  }
                  className='icon-button'
                  title={`Reproducir (${preferredSpeed}x)`}
                >
                  <VolumeUpIcon />
                </button>{' '}
                {/* Indicador de reproducción */}
                {playingIndex === currentPairIndex && (
                  <span className='playing-indicator'>🔊 Reproduciendo...</span>
                )}
                {/* ⚙️ Menú de velocidad */}
                <button
                  onClick={(e) =>
                    handleOpenSpeedMenu(
                      e,
                      teacherLine.textEnglish,
                      currentPairIndex
                    )
                  }
                  className='icon-button'
                  title='Opciones de velocidad'
                >
                  <MoreVertIcon />
                </button>
              </div>

              {studentLine && (
                <div className='chat-bubble student'>
                  <strong>Student:</strong>
                  <p>{studentLine.textEnglish}</p>
                  <p className='text-spanish'>({studentLine.textSpanish})</p>
                  {/* 🔊 Reproduce directamente */}
                  <button
                    onClick={() =>
                      handlePlayAudio(
                        studentLine.textEnglish,
                        currentPairIndex + 1,
                        preferredSpeed
                      )
                    }
                    className='icon-button'
                    title={`Reproducir (${preferredSpeed}x)`}
                  >
                    <VolumeUpIcon />
                  </button>

                  {/* ⚙️ Configurar velocidad */}
                  <button
                    onClick={(e) =>
                      handleOpenSpeedMenu(
                        e,
                        studentLine.textEnglish,
                        currentPairIndex + 1
                      )
                    }
                    className='icon-button'
                    title='Opciones de velocidad'
                  >
                    <MoreVertIcon />
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
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleCloseSpeedMenu}
                    >
                      <MenuItem onClick={() => handleSelectSpeed(0.75)}>
                        0.75x
                      </MenuItem>
                      <MenuItem onClick={() => handleSelectSpeed(1)}>
                        1x
                      </MenuItem>
                      <MenuItem onClick={() => handleSelectSpeed(1.25)}>
                        1.25x
                      </MenuItem>
                    </Menu>

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
                    <div className='recording-indicator'>
                      <p>🎙 Grabando... {recordingTime}s</p>
                    </div>
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
