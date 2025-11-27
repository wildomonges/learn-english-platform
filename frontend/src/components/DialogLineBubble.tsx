import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Box,
} from '@mui/material';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import MicIcon from '@mui/icons-material/Mic';
import SendIcon from '@mui/icons-material/Send';
import '../styles/DialogLineBubble.css';

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
    <Card
      sx={{
        mb: 2,
        borderLeft: `6px solid var(--accent)`,
        borderRadius: 2,
        boxShadow: `0px 2px 6px var(--border-soft)`,
        background: 'var(--card-bg)',
        color: ' #38bdf8',
      }}
    >
      <CardContent>
        {/* Header */}
        <Typography variant='subtitle2' sx={{ color: 'var(--muted)' }}>
          {speaker}
        </Typography>

        {/* English */}
        <Typography variant='body1' sx={{ fontWeight: 500, mt: 1 }}>
          {textEnglish}
        </Typography>

        {/* Spanish */}
        <Typography variant='body2' sx={{ color: 'var(--muted)' }}>
          ({textSpanish})
        </Typography>

        {/* Audio controls */}
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
          <IconButton
            onClick={() => onPlayAudio(textEnglish, order, preferredSpeed)}
            title={`Reproducir (${preferredSpeed}x)`}
            sx={{ color: 'var(--accent)' }}
          >
            <VolumeUpIcon />
          </IconButton>

          <IconButton
            onClick={(e) => onOpenSpeedMenu(e, textEnglish, order)}
            title='Opciones de velocidad'
            sx={{ color: 'var(--accent)' }}
          >
            <MoreVertIcon />
          </IconButton>

          {playingIndex === order && (
            <Typography
              variant='caption'
              sx={{ ml: 1, fontWeight: 500, color: 'var(--accent)' }}
            >
              🔊 Reproduciendo...
            </Typography>
          )}

          {/* Menú de velocidad */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={onCloseSpeedMenu}
          >
            {[0.75, 1, 1.25, 1.5].map((s) => (
              <MenuItem key={s} onClick={() => onSelectSpeed(s)}>
                {s}x
              </MenuItem>
            ))}
          </Menu>
        </Box>

        {/* Student response */}
        {isStudent && (
          <>
            <Box
              sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mt: 2 }}
            >
              <TextField
                fullWidth
                multiline
                minRows={2}
                variant='outlined'
                placeholder='Tu respuesta...'
                value={responseValue || ''}
                onChange={(e) => onResponseChange?.(e.target.value)}
                sx={{
                  background: 'rgba(241, 245, 249, 0.65)',
                  color: 'var(--text)',

                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: 'var(--border-soft)' },
                    '&:hover fieldset': { borderColor: 'var(--accent)' },
                  },
                }}
              />

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <IconButton
                  onClick={onMicClick}
                  sx={{ color: 'var(--accent)' }}
                >
                  <MicIcon />
                </IconButton>
                <IconButton
                  onClick={onSendClick}
                  sx={{ color: 'var(--accent)' }}
                >
                  <SendIcon />
                </IconButton>
              </Box>
            </Box>

            {isRecording && (
              <Typography
                variant='body2'
                sx={{ mt: 1, color: 'var(--accent)' }}
              >
                🎙 Grabando... {recordingTime}s
              </Typography>
            )}

            {responseFeedback && (
              <Typography
                variant='body2'
                sx={{ mt: 1, fontWeight: 500, color: 'var(--accent)' }}
              >
                {responseFeedback}
              </Typography>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default DialogLineBubble;
