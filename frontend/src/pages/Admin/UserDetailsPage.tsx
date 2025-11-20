import React, { useEffect, useState, useMemo } from 'react';
import Sidebar from '../../components/Sidebar';
import '../../styles/UserDetails.css';
import { motion } from 'framer-motion';
import {
  CircularProgress,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Stack,
  Grid,
  Skeleton,
  Box,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useNavigate } from 'react-router-dom';

interface Dialog {
  id: number;
  prompt: string;
  response: string;
  score: number;
}

interface Practica {
  id: number;
  topic: string;
  interest: string;
  score: number;
  completed: boolean;
  dialogs: Dialog[];
}

interface User {
  nombreCompleto: string;
  practicas: Practica[];
}

const getProgressColor = (score: number) => {
  if (score >= 80) return '#4caf50';
  if (score >= 50) return '#ff9800';
  return '#f44336';
};

interface CircularProgressWithLabelProps {
  value: number;
}

const CircularProgressWithLabel: React.FC<CircularProgressWithLabelProps> = ({
  value,
}) => (
  <Box sx={{ position: 'relative', display: 'inline-flex' }}>
    <CircularProgress
      variant='determinate'
      value={value}
      size={80}
      thickness={5}
      style={{ color: getProgressColor(value) }}
    />
    <Box
      sx={{
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        position: 'absolute',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Typography
        variant='caption'
        component='div'
        style={{ color: getProgressColor(value), fontWeight: 'bold' }}
      >
        {`${value}%`}
      </Typography>
    </Box>
  </Box>
);

const UserDetailsPage: React.FC = () => {
  const [userData, setUserData] = useState<User | null>(null);
  const [isDarkMode] = useState(true);
  const navigate = useNavigate();

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: isDarkMode ? 'dark' : 'light',
        },
      }),
    [isDarkMode]
  );

  // Simulamos carga
  useEffect(() => {
    setTimeout(() => {
      setUserData({
        nombreCompleto: 'Juan Pérez',
        practicas: [
          {
            id: 1,
            topic: 'Frontend',
            interest: 'React',
            score: 85,
            completed: true,
            dialogs: [
              {
                id: 1,
                prompt: 'What is JSX?',
                response: 'A JS syntax extension',
                score: 90,
              },
              {
                id: 2,
                prompt: 'What are hooks?',
                response: 'Functions in React',
                score: 80,
              },
            ],
          },
          {
            id: 2,
            topic: 'Trabajo',
            interest: 'Entrevista',
            score: 60,
            completed: false,
            dialogs: [
              {
                id: 1,
                prompt: 'Tell me about yourself.',
                response: 'I study programming...',
                score: 65,
              },
            ],
          },
        ],
      });
    }, 1500);
  }, []);

  const averageScore = useMemo(() => {
    if (!userData) return 0;
    return Math.round(
      userData.practicas.reduce((acc, p) => acc + p.score, 0) /
        userData.practicas.length
    );
  }, [userData]);

  return (
    <ThemeProvider theme={theme}>
      <div
        className={`user-details-page-wrapper ${isDarkMode ? 'dark' : 'light'}`}
      >
        <Sidebar activeTab='students' setActiveTab={() => {}} />

        <div className='user-details-page-container'>
          <motion.div
            className='user-details-box'
            initial={{ opacity: 0, scale: 0.9, filter: 'blur(6px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <div className='user-header'>
              {userData ? (
                <Typography variant='h4' className='user-name'>
                  {userData.nombreCompleto}
                </Typography>
              ) : (
                <Skeleton variant='text' width={200} height={50} />
              )}

              <div className='circular-progress-wrapper'>
                {userData ? (
                  <CircularProgressWithLabel value={averageScore} />
                ) : (
                  <Skeleton variant='circular' width={80} height={80} />
                )}
              </div>
            </div>

            <Typography variant='h5' className='section-title'>
              📚 Prácticas Realizadas
            </Typography>

            <Grid container spacing={3} justifyContent='center'>
              {userData
                ? userData.practicas.map((practica) => (
                    <Grid key={practica.id}>
                      <Card className='practice-card'>
                        <CardContent>
                          <Typography variant='h6'>{practica.topic}</Typography>
                          <Typography variant='body2'>
                            {practica.interest}
                          </Typography>

                          <LinearProgress
                            variant='determinate'
                            value={practica.score}
                            sx={{
                              height: 8,
                              borderRadius: 5,
                              backgroundColor: 'rgba(255,255,255,0.15)',
                              '& .MuiLinearProgress-bar': {
                                borderRadius: 5,
                                backgroundColor: getProgressColor(
                                  practica.score
                                ),
                              },
                            }}
                          />

                          <Chip
                            label={
                              practica.completed ? 'Completado' : 'En progreso'
                            }
                            sx={{
                              marginTop: 1,
                              fontWeight: '500',
                              backgroundColor: 'rgba(255,255,255,0.08)',
                              color: '#f1f5f9',
                            }}
                          />

                          <Accordion
                            className='dialogs-accordion'
                            sx={{
                              background: 'rgba(255,255,255,0.05)',
                              boxShadow: 'none',
                              borderRadius: 1,
                            }}
                          >
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                              <Typography>
                                🗨️ Ver diálogos ({practica.dialogs.length})
                              </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                              <Stack spacing={1}>
                                {practica.dialogs.map((d) => (
                                  <div key={d.id} className='dialog-item'>
                                    <Typography variant='body2'>
                                      📝 {d.prompt}
                                    </Typography>
                                    <Typography variant='body2'>
                                      💬 {d.response}
                                    </Typography>
                                    <Typography
                                      variant='caption'
                                      style={{
                                        color: getProgressColor(d.score),
                                      }}
                                    >
                                      ⭐ {d.score}%
                                    </Typography>
                                  </div>
                                ))}
                              </Stack>
                            </AccordionDetails>
                          </Accordion>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))
                : [...Array(3)].map((_, i) => (
                    <Skeleton
                      key={i}
                      variant='rectangular'
                      width={250}
                      height={200}
                      style={{ borderRadius: 12 }}
                    />
                  ))}
            </Grid>

            <div className='back-button-container'>
              <button
                className='back-button'
                onClick={() => navigate('/admin?tab=students')}
              >
                ⬅ Volver a Usuarios
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default UserDetailsPage;
