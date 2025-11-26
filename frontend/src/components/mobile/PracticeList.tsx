import React from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Typography,
  LinearProgress,
  Button,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useNavigate } from 'react-router-dom';
import type { Practice } from '../../interfaces/Practice';

interface PracticeListProps {
  practices: Practice[];
  isMobile?: boolean;
  setDrawerOpen?: (open: boolean) => void;
}

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

const PracticeList: React.FC<PracticeListProps> = ({
  practices,
  isMobile = false,
  setDrawerOpen,
}) => {
  const navigate = useNavigate();

  if (practices.length === 0) {
    return (
      <Box p={2} textAlign='center' sx={{ color: 'var(--muted)' }}>
        <Typography>No tienes prácticas aún.</Typography>
      </Box>
    );
  }

  return (
    <>
      {practices.map((p) => {
        const studentDialogs = p.dialogs.filter((d) => d.speaker === 'Student');
        const total = studentDialogs.length;
        const done = studentDialogs.filter((d) => d.completed).length;
        const progress = total ? Math.round((done / total) * 100) : 0;

        return (
          <Accordion
            key={p.id}
            data-testid='practice-card'
            sx={{
              mb: 1,
              borderRadius: 2,
              boxShadow: '0 4px 12px var(--border-soft)',
              px: 1,
              py: 0.5,
              backgroundColor: 'var(--card-bg)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: 'var(--text)',
              '&:before': { display: 'none' },
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{ color: 'var(--accent)' }} />}
              sx={{ minHeight: '56px' }}
            >
              <Box sx={{ width: '100%' }}>
                <Typography fontSize='1rem' fontWeight='600'>
                  {p.name}
                </Typography>
                <Typography
                  variant='caption'
                  sx={{ color: 'var(--muted)', wordBreak: 'break-word' }}
                >
                  Interés: {p.interest}
                </Typography>
                <Typography
                  variant='caption'
                  sx={{ display: 'block', mt: 0.3, color: 'var(--muted)' }}
                >
                  {formatDate(p.createdAt)} • {done}/{total}
                </Typography>
                <LinearProgress
                  variant='determinate'
                  value={progress}
                  sx={{
                    mt: 0.5,
                    height: 4,
                    borderRadius: 5,
                    backgroundColor: 'rgba(241,245,249,0.1)',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: 'var(--accent)',
                    },
                  }}
                />
              </Box>
            </AccordionSummary>

            <AccordionDetails sx={{ py: 1 }}>
              <Button
                fullWidth
                variant='contained'
                size='small'
                sx={{
                  backgroundColor: 'var(--accent)',
                  color: 'var(--text)',
                  fontSize: '0.75rem',
                  py: 1,
                  '&:hover': {
                    backgroundColor: 'rgba(56, 189, 248, 0.8)',
                  },
                }}
                onClick={() => {
                  if (isMobile && setDrawerOpen) setDrawerOpen(false);
                  navigate(`/practicas/${p.id}`);
                }}
              >
                {done === total ? 'Ver resultado' : 'Continuar'}
              </Button>
            </AccordionDetails>
          </Accordion>
        );
      })}
    </>
  );
};

export default PracticeList;
