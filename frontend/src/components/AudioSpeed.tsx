import React from 'react';
import { Menu, MenuItem, IconButton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

type Props = {
  anchorEl: HTMLElement | null;
  onOpen: (e: React.MouseEvent<HTMLElement>) => void;
  onClose: () => void;
  onSelectSpeed: (speed: number) => void;
};

export const AudioSpeed: React.FC<Props> = ({
  anchorEl,
  onOpen,
  onClose,
  onSelectSpeed,
}) => (
  <div className='audio-speed'>
    <IconButton onClick={onOpen} className='speed-button' aria-label='speed'>
      <MoreVertIcon />
    </IconButton>
    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={onClose}>
      {[0.75, 1, 1.25].map((s) => (
        <MenuItem key={s} onClick={() => onSelectSpeed(s)}>
          {s}x
        </MenuItem>
      ))}
    </Menu>
  </div>
);
