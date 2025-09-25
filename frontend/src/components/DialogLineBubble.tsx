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
        borderLeft: `6px solid ${
          speaker === 'Teacher' ? '#1976d2' : '#4caf50'
        }`,
        borderRadius: 2,
        boxShadow: 2,
      }}
    >
      <CardContent>
        {/* Header */}
        <Typography variant='subtitle2' color='text.secondary'>
          {speaker}
        </Typography>

        {/* English */}
        <Typography variant='body1' sx={{ fontWeight: 500, mt: 1 }}>
          {textEnglish}
        </Typography>

        {/* Spanish */}
        <Typography variant='body2' color='text.secondary'>
          ({textSpanish})
        </Typography>

        {/* Audio controls */}
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
          <IconButton
            onClick={() => onPlayAudio(textEnglish, order, preferredSpeed)}
            title={`Reproducir (${preferredSpeed}x)`}
          >
            <VolumeUpIcon />
          </IconButton>

          <IconButton
            onClick={(e) => onOpenSpeedMenu(e, textEnglish, order)}
            title='Opciones de velocidad'
          >
            <MoreVertIcon />
          </IconButton>

          {playingIndex === order && (
            <Typography
              variant='caption'
              color='primary'
              sx={{ ml: 1, fontWeight: 500 }}
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
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 1,
                mt: 2,
              }}
            >
              <TextField
                fullWidth
                multiline
                minRows={2}
                variant='outlined'
                placeholder='Tu respuesta...'
                value={responseValue || ''}
                onChange={(e) => onResponseChange?.(e.target.value)}
              />

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <IconButton onClick={onMicClick} color='primary'>
                  <MicIcon />
                </IconButton>
                <IconButton onClick={onSendClick} color='success'>
                  <SendIcon />
                </IconButton>
              </Box>
            </Box>

            {isRecording && (
              <Typography variant='body2' color='error' sx={{ mt: 1 }}>
                🎙 Grabando... {recordingTime}s
              </Typography>
            )}

            {responseFeedback && (
              <Typography
                variant='body2'
                color='primary'
                sx={{ mt: 1, fontWeight: 500 }}
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
