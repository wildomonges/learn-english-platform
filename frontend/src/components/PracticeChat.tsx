import React, { useEffect, useRef, useState, useCallback } from 'react';
import '../styles/PracticeChat.css';
import CircularProgress from '@mui/material/CircularProgress';
import ProgressBar from './ProgressBar';
import { fetchDialogs, fetchSpeech } from '../api/speakingAPI';
import { createPractice, updatePracticeDialog } from '../api/practicesAPI';
import { startVoiceRecognition } from '../utils/audio';
import {
  calculateSimilarity,
  getSimilarityFeedback,
} from '../utils/practiceUtils';
import DialogLineBubble from './DialogLineBubble';
import { useAuth } from '../context/AuthContext';
import type { DialogLine } from '../types/Dialog';

type Props = {
  topic: string;
  interest: string;
  existingDialogs: DialogLine[];
  onBack: () => void;
  practiceId: number;
};
const PracticeChat: React.FC<Props> = ({
  topic,
  interest,
  existingDialogs,
  onBack,
  practiceId,
}) => {
  const { user } = useAuth();
  const [dialogs, setDialogs] = useState<DialogLine[]>(existingDialogs || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPairIndex, setCurrentPairIndex] = useState(0);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const [preferredSpeed, setPreferredSpeed] = useState(1);
  const [userResponses, setUserResponses] = useState<Record<number, string>>(
    {}
  );
  const [responseFeedback, setResponseFeedback] = useState<
    Record<number, string>
  >({});

  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [localPracticeId, setLocalPracticeId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const totalPairs = Math.floor(dialogs.length / 2);
  const currentStep = Math.floor(currentPairIndex / 2);
  const activePracticeIdNumber: number | null =
    practiceId ?? (localPracticeId ? Number(localPracticeId) : null);

  // Reproducir audio
  const handlePlayAudio = useCallback(
    async (text: string, index: number, rate: number = 1) => {
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
      } catch {
        setPlayingIndex(null);
        setError('No se pudo reproducir el audio.');
      }
    },
    [playingIndex]
  );

  const handleCreatePractice = async (dialogsData: DialogLine[]) => {
    if (!user || localPracticeId) return;

    try {
      const practice = await createPractice({
        userId: Number(user.id), // 🔹
        name: `Practice on ${topic}`,
        topic,
        interest,
        dialogs: dialogsData
          .filter((line) => line.textEnglish && line.textSpanish)
          .map((line, i) => ({
            id: line.id ?? i, // 🔹
            speaker: line.speaker,
            textEnglish: line.textEnglish,
            textSpanish: line.textSpanish,
            response: '',
            order: i,
            score: 0,
            completed: line.speaker === 'Teacher',
            dialog: line.textEnglish,
          })),
      });

      setLocalPracticeId(practice.id.toString());
    } catch {
      setError('Error al crear la práctica.');
    }
  };

  //  Actualizar un solo diálogo
  const updateDialog = async () => {
    if (!activePracticeIdNumber) {
      setError('No se encontró la práctica activa para actualizar.');
      goToNextPair();
      return;
    }

    const idx = currentPairIndex + 1;
    const dialogStudent = dialogs[idx];
    if (!dialogStudent) return;
    const response = userResponses[idx] || '';
    const score = calculateSimilarity(response, dialogStudent.textEnglish);

    try {
      await updatePracticeDialog(activePracticeIdNumber, dialogStudent.id!, {
        response,
        score,
        completed: true,
      });

      const updated = dialogs.map((d, i) =>
        i === idx ? { ...d, response, score, completed: true } : d
      );
      setDialogs(updated);
      setResponseFeedback((prev) => ({
        ...prev,
        [idx]: getSimilarityFeedback(score),
      }));

      setCurrentPairIndex((prev) => prev + 2);
    } catch {
      setError('Error al actualizar el diálogo.');
    }
  };

  //  Verificar respuesta manualmente
  const handleSendResponse = (index: number) => {
    const userResponse = userResponses[index] || '';
    const correct = dialogs[index]?.textEnglish || '';
    const similarity = calculateSimilarity(userResponse, correct);
    const feedback = getSimilarityFeedback(similarity);
    setResponseFeedback((prev) => ({ ...prev, [index]: feedback }));
  };

  const goToPreviousPair = () =>
    setCurrentPairIndex((prev) => Math.max(prev - 2, 0));
  const goToNextPair = () => setCurrentPairIndex((prev) => prev + 2);

  // Cargar diálogos
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (existingDialogs && existingDialogs.length > 0) {
        setDialogs(existingDialogs);

        const startingOrder =
          existingDialogs.find((d) => d.speaker === 'Student' && !d.completed)
            ?.order ?? 1;
        setCurrentPairIndex(Math.max(startingOrder - 1, 0));

        const saved: Record<number, string> = {};
        existingDialogs.forEach((d) => (saved[d.order] = d.response || ''));
        setUserResponses(saved);
        return;
      }

      setLoading(true);
      try {
        const data = await fetchDialogs(topic, interest);
        if (cancelled) return;

        const fetched: DialogLine[] = data.dialogs || [];
        setDialogs(fetched);

        if (!practiceId && !localPracticeId) {
          await handleCreatePractice(fetched);
        }
      } catch {
        if (!cancelled) {
          setError('No se pudo cargar el diálogo. Intenta de nuevo.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [topic, interest, existingDialogs, practiceId, localPracticeId]);

  const teacherLine = dialogs[currentPairIndex];
  const studentLine = dialogs[currentPairIndex + 1];

  return (
    <div className={`practice-chat ${loading ? 'loading-state' : ''}`}>
      {loading ? (
        <div className='loading-container'>
          <h2 className='dialog-title'>
            Diálogo: {interest} / {topic}
          </h2>
          <div className='loading-message'>
            🧠 Estamos preparando tu clase...
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

          <ProgressBar current={currentStep} total={totalPairs} />

          {error && <p className='error'>{error}</p>}

          {teacherLine && (
            <div className='dialog-pair'>
              <DialogLineBubble
                speaker='Teacher'
                textEnglish={teacherLine.textEnglish}
                textSpanish={teacherLine.textSpanish}
                order={teacherLine.order}
                playingIndex={playingIndex}
                preferredSpeed={preferredSpeed}
                anchorEl={anchorEl}
                onPlayAudio={handlePlayAudio}
                onOpenSpeedMenu={(e) => setAnchorEl(e.currentTarget)}
                onCloseSpeedMenu={() => setAnchorEl(null)}
                onSelectSpeed={(speed) => setPreferredSpeed(speed)}
              />

              {studentLine && (
                <DialogLineBubble
                  speaker='Student'
                  textEnglish={studentLine.textEnglish}
                  textSpanish={studentLine.textSpanish}
                  order={studentLine.order}
                  playingIndex={playingIndex}
                  preferredSpeed={preferredSpeed}
                  anchorEl={anchorEl}
                  onPlayAudio={handlePlayAudio}
                  onOpenSpeedMenu={(e) => setAnchorEl(e.currentTarget)}
                  onCloseSpeedMenu={() => setAnchorEl(null)}
                  onSelectSpeed={(speed) => setPreferredSpeed(speed)}
                  isStudent
                  responseValue={userResponses[studentLine.order] || ''}
                  onResponseChange={(val) =>
                    setUserResponses((prev) => ({
                      ...prev,
                      [studentLine.order]: val,
                    }))
                  }
                  onMicClick={() =>
                    startVoiceRecognition(
                      studentLine.order,
                      setUserResponses,
                      setResponseFeedback,
                      setIsRecording,
                      setRecordingTime
                    )
                  }
                  onSendClick={() => handleSendResponse(studentLine.order)}
                  isRecording={isRecording}
                  recordingTime={recordingTime}
                  responseFeedback={responseFeedback[studentLine.order]}
                />
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
              <button onClick={updateDialog}>💾 Guardar y continuar</button>
            )}

            {currentPairIndex + 2 >= dialogs.length && (
              <button
                onClick={() =>
                  activePracticeIdNumber
                    ? updateDialog()
                    : handleCreatePractice(dialogs)
                }
              >
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
