import React from 'react';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import MicIcon from '@mui/icons-material/Mic';
import SendIcon from '@mui/icons-material/Send';
import { Menu, MenuItem } from '@mui/material';
import '../styles/PracticeChat.css';

type Props = {
  speaker: 'Teacher' | 'Student';
  textEnglish: string;
  textSpanish: string;
  order: number;
  playingIndex: number | null;
  preferredSpeed: number;
  anchorEl: HTMLElement | null;

  onPlayAudio: (text: string, order: number, rate?: number) => void;
  onOpenSpeedMenu: (
    e: React.MouseEvent<HTMLElement>,
    text: string,
    order: number
  ) => void;
  onCloseSpeedMenu: () => void;
  onSelectSpeed: (speed: number) => void;

  isStudent?: boolean;
  responseValue?: string;
  onResponseChange?: (value: string) => void;
  onMicClick?: () => void;
  onSendClick?: () => void;
  isRecording?: boolean;
  recordingTime?: number;
  responseFeedback?: string;
};

const DialogLineBubble: React.FC<Props> = ({
  speaker,
  textEnglish,
  textSpanish,
  order,
  playingIndex,
  preferredSpeed,
  anchorEl,
  onPlayAudio,
  onOpenSpeedMenu,
  onCloseSpeedMenu,
  onSelectSpeed,
  isStudent,
  responseValue,
  onResponseChange,
  onMicClick,
  onSendClick,
  isRecording,
  recordingTime,
  responseFeedback,
}) => {
  return (
    <div className={`chat-bubble ${speaker.toLowerCase()}`}>
      <strong>{speaker}:</strong>
      <p>{textEnglish}</p>
      <p className='text-spanish'>({textSpanish})</p>

      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <button
          onClick={() => onPlayAudio(textEnglish, order, preferredSpeed)}
          className='icon-button'
          title={`Reproducir (${preferredSpeed}x)`}
        >
          <VolumeUpIcon />
        </button>

        <button
          onClick={(e) => onOpenSpeedMenu(e, textEnglish, order)}
          className='icon-button'
          title='Opciones de velocidad'
        >
          <MoreVertIcon />
        </button>

        {playingIndex === order && (
          <span className='playing-indicator'>🔊 Reproduciendo...</span>
        )}
      </div>

      {/* SOLO PARA STUDENT */}
      {isStudent && (
        <>
          <div className='response-row'>
            <textarea
              className='response-input'
              rows={2}
              placeholder='Tu respuesta...'
              value={responseValue || ''}
              onChange={(e) => onResponseChange?.(e.target.value)}
            />

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={onCloseSpeedMenu}
            >
              {[0.75, 1, 1.25].map((s) => (
                <MenuItem key={s} onClick={() => onSelectSpeed(s)}>
                  {s}x
                </MenuItem>
              ))}
            </Menu>

            <button onClick={onMicClick} className='icon-button'>
              <MicIcon />
            </button>
            <button onClick={onSendClick} className='icon-button'>
              <SendIcon />
            </button>
          </div>

          {isRecording && (
            <div className='recording-indicator'>
              <p>🎙 Grabando... {recordingTime}s</p>
            </div>
          )}

          {responseFeedback && <p className='feedback'>{responseFeedback}</p>}
        </>
      )}
    </div>
  );
};

export default DialogLineBubble;
