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

const getScoreClass = (score: number) =>
  score >= 80 ? 'high' : score >= 50 ? 'medium' : 'low';
const getProgressColor = (score: number) =>
  score >= 80 ? '#355c7d' : score >= 50 ? '#355c7d' : '#355c7d';

const CircularProgressWithLabel: React.FC<{ value: number }> = ({ value }) => (
  <motion.div whileHover={{ scale: 1.1 }}>
    <Box className='circular-progress-wrapper'>
      <CircularProgress
        variant='determinate'
        value={value}
        size={90}
        thickness={6}
        style={{ color: getProgressColor(value) }}
      />
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography
          variant='caption'
          sx={{
            color: getProgressColor(value),
            fontWeight: 'bold',
            fontSize: '1rem',
          }}
        >
          {`${value}%`}
        </Typography>
      </Box>
    </Box>
  </motion.div>
);

const UserDetailsPage: React.FC = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => setCurrentPage(1), [userData]);

  const totalPages = useMemo(
    () => Math.ceil((userData?.practicas?.length ?? 0) / itemsPerPage),
    [userData]
  );
  const paginatedPracticas = useMemo(
    () =>
      userData?.practicas?.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      ) ?? [],
    [currentPage, userData]
  );

  useEffect(() => {
    const loadData = async () => {
      try {
        const [userInfo, practices] = await Promise.all([
          fetchUserById(userId!),
          fetchUserPractices(userId!),
        ]);
        const practicasFormateadas: Practica[] = practices.map((p: any) => ({
          id: Number(p.id),
          topic: p.topic || 'Sin tema',
          interest: p.interest || 'Sin interés',
          score: p.score ?? 0,
          completed: p.completed ?? false,
          dialogs:
            p.dialogs?.filter(
              (d: any) => d.prompt?.trim() || d.response?.trim()
            ) ?? [],
        }));
        setUserData({
          nombreCompleto: `${userInfo.firstName} ${userInfo.lastName}`,
          practicas: practicasFormateadas,
        });
      } catch {
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

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: isDarkMode ? 'dark' : 'light',
          background: {
            default: isDarkMode ? '#0b1120' : '#f5f5f5',
            paper: isDarkMode ? '#1e293b' : '#ffffff',
          },
          text: {
            primary: isDarkMode ? '#f1f5f9' : '#111827',
            secondary: isDarkMode ? '#cbd5e1' : '#6b7280',
          },
        },
      }),
    [isDarkMode]
  );

  return (
    <ThemeProvider theme={theme}>
      <div
        className={`user-details-page-wrapper ${isDarkMode ? 'dark' : 'light'}`}
      >
        <Sidebar activeTab='students' setActiveTab={() => {}} />
        <div className='user-details-page-container'>
          <motion.div
            className='user-details-box'
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
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

            <div className='user-header'>
              {loading ? (
                <Skeleton variant='text' width={200} height={50} />
              ) : (
                <Typography variant='h4' className='user-name'>
                  {userData?.nombreCompleto}
                </Typography>
              )}
              {loading ? (
                <Skeleton variant='circular' width={90} height={90} />
              ) : (
                <CircularProgressWithLabel value={averageScore} />
              )}
            </div>

            <Typography variant='h5' className='section-title'>
              Prácticas Realizadas
            </Typography>
            {fetchError && (
              <Typography color='error' sx={{ textAlign: 'center', mb: 2 }}>
                {fetchError}
              </Typography>
            )}

            <Grid container spacing={3} justifyContent='center'>
              {loading
                ? [...Array(3)].map((_, i) => (
                    <Skeleton
                      key={i}
                      variant='rectangular'
                      width={280}
                      height={200}
                      style={{ borderRadius: 16 }}
                    />
                  ))
                : paginatedPracticas.map((practica) => (
                    <Grid key={practica.id}>
                      <motion.div
                        whileHover={{ y: -7, scale: 1.02 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                      >
                        <Card
                          className={`practice-card score-${getScoreClass(
                            practica.score
                          )}`}
                          style={{
                            borderLeft: `6px solid ${getProgressColor(
                              practica.score
                            )}`,
                          }}
                        >
                          <CardContent>
                            <Typography variant='h6'>
                              {practica.topic}
                            </Typography>
                            <Typography variant='body2' sx={{ mb: 1 }}>
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
                                practica.completed
                                  ? 'Completado'
                                  : 'En progreso'
                              }
                              className={`practice-chip ${
                                practica.completed ? 'success' : 'warning'
                              }`}
                              sx={{ mt: 1 }}
                            />
                            <Accordion
                              className='dialogs-accordion'
                              sx={{
                                mt: 1,
                                bgcolor: 'transparent',
                                boxShadow: 'none',
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
                                          fontWeight: 'bold',
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
                      </motion.div>
                    </Grid>
                  ))}
            </Grid>

            {(userData?.practicas?.length ?? 0) > itemsPerPage && (
              <div className='pagination-container'>
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                >
                  ⬅
                </button>
                <span>
                  {currentPage} / {totalPages}
                </span>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                >
                  ➡
                </button>
              </div>
            )}

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
