import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  Switch,
  FormControlLabel,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { fetchUserPractices } from '../../api/practicesAPI';
import { fetchUserById } from '../../api/usersAPI';

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

// Helpers
const getScoreClass = (score: number) => {
  if (score >= 80) return 'high';
  if (score >= 50) return 'medium';
  return 'low';
};

const getProgressColor = (score: number) => {
  if (score >= 80) return '#4caf50';
  if (score >= 50) return '#ff9800';
  return '#f44336';
};

const CircularProgressWithLabel: React.FC<{ value: number }> = ({ value }) => (
  <Box className='circular-progress-wrapper'>
    <CircularProgress
      variant='determinate'
      value={value}
      size={80}
      thickness={5}
      style={{ color: getProgressColor(value) }}
    />
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Typography
        variant='caption'
        style={{ color: getProgressColor(value), fontWeight: 'bold' }}
      >
        {`${value}%`}
      </Typography>
    </Box>
  </Box>
);

const UserDetailsPage: React.FC = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: isDarkMode ? 'dark' : 'light',
          primary: { main: '#2563eb' },
          secondary: { main: isDarkMode ? '#38bdf8' : '#3b82f6' },
          success: { main: isDarkMode ? '#4caf50' : '#16a34a' },
          warning: { main: isDarkMode ? '#ff9800' : '#f59e0b' },
          error: { main: isDarkMode ? '#f44336' : '#dc2626' },
          background: {
            default: isDarkMode ? '#0b1120' : '#ffffff',
            paper: isDarkMode ? '#1e293b' : '#f8fafc',
          },
          text: {
            primary: isDarkMode ? '#f1f5f9' : '#111827',
            secondary: isDarkMode ? '#cbd5e1' : '#6b7280',
          },
        },
      }),
    [isDarkMode]
  );

  //API
  useEffect(() => {
    const loadData = async () => {
      try {
        const [userInfo, practices] = await Promise.all([
          fetchUserById(userId!),
          fetchUserPractices(userId!),
        ]);

        const practicasFormateadas = practices.map((p: any) => ({
          id: Number(p.id),
          topic: p.topic || 'Sin tema',
          interest: p.interest || 'Sin interés',
          score: p.score ?? 0,
          completed: p.completed ?? false,
          dialogs:
            p.dialogs?.filter(
              (d: any) => d.prompt?.trim() || d.response?.trim()
            ) || [],
        }));

        setUserData({
          nombreCompleto: `${userInfo.firstName} ${userInfo.lastName}`,
          practicas: practicasFormateadas,
        });
      } catch (err) {
        console.error(err);
        setFetchError('Error al cargar los datos del usuario');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [userId]);

  const averageScore = useMemo(() => {
    const practicas = userData?.practicas ?? [];
    if (!practicas.length) return 0;
    return Math.round(
      practicas.reduce((acc, p) => acc + p.score, 0) / practicas.length
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
            {/*Light/dark mode switch*/}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={isDarkMode}
                    onChange={() => setIsDarkMode(!isDarkMode)}
                  />
                }
                label={isDarkMode ? 'Dark Mode' : 'Light Mode'}
              />
            </Box>

            {/* HEADER */}
            <div className='user-header'>
              {loading ? (
                <Skeleton variant='text' width={200} height={50} />
              ) : (
                <Typography variant='h4' className='user-name'>
                  {userData?.nombreCompleto || 'Sin nombre'}
                </Typography>
              )}

              {loading ? (
                <Skeleton variant='circular' width={80} height={80} />
              ) : (
                <CircularProgressWithLabel value={averageScore} />
              )}
            </div>

            <Typography variant='h5' className='section-title'>
              📚 Prácticas Realizadas
            </Typography>

            {fetchError && (
              <Typography color='error' sx={{ textAlign: 'center', mb: 2 }}>
                {fetchError}
              </Typography>
            )}

            <Grid container spacing={3} justifyContent='center'>
              {loading ? (
                [...Array(3)].map((_, i) => (
                  <Skeleton
                    key={i}
                    variant='rectangular'
                    width={280}
                    height={200}
                    style={{ borderRadius: 12 }}
                  />
                ))
              ) : userData?.practicas.length === 0 ? (
                <Typography
                  variant='body1'
                  sx={{
                    opacity: 0.7,
                    mt: 3,
                    textAlign: 'center',
                    width: '100%',
                  }}
                >
                  No hay prácticas registradas ❌
                </Typography>
              ) : (
                userData?.practicas.map((practica) => (
                  <Grid key={practica.id}>
                    <Card
                      className={`practice-card score-${getScoreClass(
                        practica.score
                      )}`}
                      style={{
                        background:
                          practica.score >= 80
                            ? 'linear-gradient(135deg, #4caf50 0%, #81c784 100%)'
                            : practica.score >= 50
                            ? 'linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)'
                            : 'linear-gradient(135deg, #f44336 0%, #e57373 100%)',
                      }}
                    >
                      <CardContent>
                        <Typography variant='h6'>{practica.topic}</Typography>
                        <Typography variant='body2'>
                          {practica.interest}
                        </Typography>

                        <LinearProgress
                          variant='determinate'
                          value={practica.score}
                          className='practice-progress'
                          style={
                            {
                              '--progress-color': getProgressColor(
                                practica.score
                              ),
                            } as React.CSSProperties
                          }
                        />

                        <Chip
                          label={
                            practica.completed ? 'Completado' : 'En progreso'
                          }
                          className={`practice-chip ${
                            practica.completed ? 'success' : 'warning'
                          }`}
                        />

                        <Accordion className='dialogs-accordion'>
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
                                    style={{ color: getProgressColor(d.score) }}
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
              )}
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
