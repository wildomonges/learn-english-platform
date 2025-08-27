import React, { useEffect, useState, useRef } from 'react';
import '../styles/PracticeChat.css';
import MicIcon from '@mui/icons-material/Mic';
import SendIcon from '@mui/icons-material/Send';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import { fetchDialogs, fetchSpeech } from '../api/speakingAPI';
import CircularProgress from '@mui/material/CircularProgress';
import ProgressBar from './ProgressBar';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useAuth } from '../context/AuthContext';
import { useFetchWithAuth } from '../api/authFetch';
import type { Dialog } from '../types/Dialog';

const SpeechRecognition =
  (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

// types.ts o donde definas el tipo DialogLine
export interface DialogLine {
  id: string;
  speaker: string;
  textEnglish: string;
  textSpanish: string;
  response: string;
  order: number;
  score: number;
  completed: boolean; // <-- agregar esta línea
}

type Props = {
  topic: string;
  interest: string;
  existingDialog: DialogLine[];
  onBack: () => void;
  practiceId: string;
};

const PracticeChat: React.FC<Props> = ({
  topic,
  interest,
  existingDialog,
  onBack,
  practiceId,
}) => {
  const [dialogs, setDialogs] = useState<DialogLine[]>(existingDialog);
  const [loading, setLoading] = useState(false);
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
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [playbackTarget, setPlaybackTarget] = useState<{
    text: string;
    index: number;
  } | null>(null);

  const totalPairs = Math.floor(dialogs.length / 2);
  const currentStep = Math.floor(currentPairIndex / 2);
  const fetchWithAuth = useFetchWithAuth();

  const { user } = useAuth();

  const loadDialogs = async () => {
    setLoading(true);
    try {
      const data = await fetchDialogs(topic, interest);
      setDialogs(data.dialogs || []);
      await submitPractice(data.dialogs);
    } catch (err) {
      console.error('Error fetching dialog:', err);
      setError('Failed to fetch dialogue. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!existingDialog || existingDialog.length === 0) {
      loadDialogs();
    } else {
      const studentDialogIndexes = existingDialog
        .map((item, index) => ({ ...item, index }))
        .filter((_, index) => index % 2 === 1); // solo los turnos del estudiante

      const firstIncompleteStudent = studentDialogIndexes.find(
        (d) => !d.response || d.response.trim() === ''
      );

      const startingIndex = Math.max(
        (firstIncompleteStudent?.index ?? 1) - 1,
        0
      );

      setDialogs(existingDialog);
      setCurrentPairIndex(startingIndex);
    }
  }, [topic, interest]);

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

  const handlePlayAudio = async (
    text: string,
    index: number,
    rate: number = 1
  ) => {
    if (playingIndex === index) return;

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
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
      setUserResponses((prev) => ({ ...prev, [index]: transcript.trim() }));
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
    const correctResponse = dialogs[index]?.textEnglish;
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

  // This function is called only to save the practice data in the database
  // right after loading the dialogs
  const submitPractice = async (dialogsData: Dialog[]) => {
    if (!user) return;
  
    const practiceData = {
      userId: user.id,
      name: `Practice on ${topic}`,
      topic,
      interest,
      dialogs: dialogsData
        .filter((line) => line.textEnglish && line.textSpanish)
        .map((line, i) => {
          if (line.speaker === 'Teacher') {
            return {
              speaker: 'Teacher',
              textEnglish: line.textEnglish,
              textSpanish: line.textSpanish,
              response: '',
              order: i,
              score: 0,
              completed: true,
            };
          } else {
            return {
              speaker: 'Student',
              textEnglish: line.textEnglish,
              textSpanish: line.textSpanish,
              response: '',
              order: i,
              score: 0,
              completed: false,
            };
          }
        }),
    };

    console.log('practiceData');
    console.log(practiceData);

    try {
      const res = await fetchWithAuth(
        'http://localhost:3000/api/v1/practices',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(practiceData),
        }
      );

      const json = await res.json();
      console.log('✅ Práctica enviada:', json);
    } catch (err) {
      console.error('❌ Error:', err);
    }
  };

  const handleSaveAndContinue = async () => {
    if (!user) return;

    const dialogStudent = dialogs[currentPairIndex + 1];
    const response = userResponses[currentPairIndex + 1] || '';
    const correct = dialogStudent?.textEnglish || '';
    const similarity = calculateSimilarity(response, correct);

    const practiceStep = {
      userId: user.id,
      name: `Practice on ${topic}`,
      topic,
      interests: interest,
      dialogs: [
        {
          speaker: 'Teacher',
          textEnglish: dialogs[currentPairIndex]?.textEnglish,
          textSpanish: dialogs[currentPairIndex]?.textSpanish,
          response: '',
          order: currentPairIndex,
          score: 0,
          completed: true,
        },
        {
          speaker: 'Student',
          textEnglish: dialogs[currentPairIndex + 1]?.textEnglish,
          textSpanish: dialogs[currentPairIndex + 1]?.textSpanish,
          response,
          order: currentPairIndex + 1,
          score: similarity,
          completed: !!response,
        },
      ],
    };

    try {
      const res = await fetchWithAuth(
        'http://localhost:3000/api/v1/practices',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(practiceStep),
        }
      );

      const json = await res.json();
      console.log('✅ Paso guardado:', json);

      goToNextPair(); // Avanzar al siguiente par
      try {
        const studentDialogLine = dialogs[currentPairIndex + 1];
        const dialogId = studentDialogLine?.id;

        if (practiceId && dialogId) {
          await fetchWithAuth(
            `/api/practices/${practiceId}/dialogs/${dialogId}/complete`,
            {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ response }), // ✅ importante: manda la respuesta
            }
          );
          console.log('✅ Diálogo marcado como completo.');

          // ✅ NUEVO: Marcar la práctica completa si es el último par
          const isLastPair = currentPairIndex + 1 >= totalPairs - 1;
          if (isLastPair) {
            await fetchWithAuth(`/api/practices/${practiceId}/complete`, {
              method: 'PATCH',
            });
            console.log('🎉 Práctica marcada como completada.');
          }
        }
      } catch (err) {
        console.error(
          '❌ Error al marcar diálogo como completo o práctica:',
          err
        );
      }
    } catch (err) {
      console.error('❌ Error al guardar paso:', err);
    }
  };

  const teacherLine = dialogs[currentPairIndex];
  const studentLine = dialogs[currentPairIndex + 1];
  console.log('dialogs');
  console.log(dialogs);
  console.log('teacher line');
  console.log(teacherLine);
  console.log('student line');
  console.log(studentLine);
  console.log('indice de teacher', currentPairIndex);
  console.log('indice de studend', currentPairIndex + 1);
  console.log('currentStep', currentStep);
  console.log('totalPairs', totalPairs);

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

          <ProgressBar current={currentStep} total={totalPairs} />
          {error && <p className='error'>{error}</p>}

          {teacherLine && (
            <div className='dialog-pair'>
              <div className='chat-bubble teacher'>
                <strong>Teacher:</strong>
                <p>{teacherLine.textEnglish}</p>
                <p className='text-spanish'>({teacherLine.textSpanish})</p>

                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                >
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
                  </button>

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

                  {playingIndex === currentPairIndex && (
                    <span className='playing-indicator'>
                      🔊 Reproduciendo...
                    </span>
                  )}
                </div>
              </div>

              {studentLine && (
                <div className='chat-bubble student'>
                  <strong>Student:</strong>
                  <p>{studentLine.textEnglish}</p>
                  <p className='text-spanish'>({studentLine.textSpanish})</p>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
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

                    {playingIndex === currentPairIndex + 1 && (
                      <span className='playing-indicator'>
                        🔊 Reproduciendo...
                      </span>
                    )}
                  </div>

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

          <div className='navigation-buttons'>
            {currentPairIndex > 0 ? (
              <button onClick={goToPreviousPair}>⬅ Back</button>
            ) : (
              <button onClick={onBack}>⬅ Volver al inicio</button>
            )}
            {currentPairIndex + 2 < dialogs.length && (
              <button onClick={handleSaveAndContinue}>
                💾 Guardar y continuar
              </button>
            )}

            {currentPairIndex + 2 >= dialogs.length && (
              <button onClick={() => {}} className='submit-button'>
                📝 Guardar práctica
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default PracticeChat;
