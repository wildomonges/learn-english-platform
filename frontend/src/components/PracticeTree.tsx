import React, { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Typography,
  LinearProgress,
  Button,
  Pagination,
  Drawer,
  IconButton,
  useMediaQuery,
  CircularProgress,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import CloseIcon from '@mui/icons-material/Close';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface Dialog {
  id: number;
  dialog: string;
  order: number;
  score: number;
  completed: boolean;
}

interface Practice {
  id: number;
  name: string;
  interest: string;
  createdAt: string;
  dialogs: Dialog[];
}

const ITEMS_PER_PAGE = 3;

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const PracticeTree: React.FC = () => {
  const [practices, setPractices] = useState<Practice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { getToken } = useAuth();
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width:768px)');

  const fetchPractices = async () => {
    try {
      const token = getToken();
      const res = await fetch(`${import.meta.env.VITE_API_URL}/practices`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Error al cargar prácticas');

      const data = await res.json();

      const sorted = [...data].sort(
        (a: Practice, b: Practice) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setPractices(sorted);
    } catch (err) {
      setError((err as Error).message || 'Error inesperado');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPractices();
  }, [getToken]);

  const totalPages = Math.ceil(practices.length / ITEMS_PER_PAGE);
  const paginatedPractices = practices.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const renderPracticeList = () => (
    <>
      {(isMobile ? practices : paginatedPractices).map((p) => {
        const total = p.dialogs.length;
        const done = p.dialogs.filter((d) => d.completed).length;
        const progress = total ? Math.round((done / total) * 100) : 0;

        return (
          <Accordion
            key={p.id}
            sx={{
              mb: 1,
              borderRadius: 2,
              boxShadow: 1,
              px: 1,
              py: 0.5,
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{ minHeight: '56px' }}
            >
              <Box sx={{ width: '100%' }}>
                <Typography fontSize='1rem' fontWeight='600'>
                  {p.name}
                </Typography>
                <Typography
                  variant='caption'
                  color='text.secondary'
                  sx={{ wordBreak: 'break-word' }}
                >
                  Interés: {p.interest}
                </Typography>
                <Typography
                  variant='caption'
                  color='text.secondary'
                  sx={{ display: 'block', mt: 0.3 }}
                >
                  {formatDate(p.createdAt)} • {done}/{total}
                </Typography>
                <LinearProgress
                  variant='determinate'
                  value={progress}
                  sx={{ mt: 0.5, height: 4, borderRadius: 5 }}
                />
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ py: 1 }}>
              <Button
                fullWidth
                variant='contained'
                size='small'
                sx={{
                  backgroundColor: '#9966cc',
                  color: '#fff',
                  fontSize: '0.75rem',
                  py: 1,
                  '&:hover': {
                    backgroundColor: '#8e7cc3',
                  },
                }}
                onClick={() => {
                  if (isMobile) setDrawerOpen(false);
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

  if (loading) {
    return (
      <Box p={4} textAlign='center'>
        <CircularProgress />
        <Typography mt={2}>Cargando tus prácticas...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={4} textAlign='center'>
        <Typography color='error' variant='body1'>
          ❌ {error}
        </Typography>
        <Button
          variant='outlined'
          sx={{ mt: 2 }}
          onClick={() => window.location.reload()}
        >
          Reintentar
        </Button>
      </Box>
    );
  }

  if (isMobile) {
    return (
      <>
        {!drawerOpen && (
          <Box
            sx={{
              position: 'fixed',
              bottom: 16,
              right: 16,
              zIndex: 1300,
              display: { xs: 'block', md: 'none' },
            }}
          >
            <Button
              variant='contained'
              onClick={() => setDrawerOpen(true)}
              sx={{
                borderRadius: '50px',
                backgroundColor: '#9966cc',
                color: '#fff',
                fontSize: '0.875rem',
                fontWeight: 'bold',
                px: 3,
                py: 1.5,
                boxShadow: 3,
                '&:hover': {
                  backgroundColor: '#8e7cc3',
                },
              }}
            >
              Mis Prácticas
            </Button>
          </Box>
        )}

        <Drawer
          anchor='bottom'
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          PaperProps={{
            sx: {
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              maxHeight: '85vh',
              overflowY: 'auto',
            },
          }}
        >
          <Box sx={{ p: 2 }}>
            <Box
              display='flex'
              justifyContent='space-between'
              alignItems='center'
              mb={2}
            >
              <Typography variant='h6' fontWeight='bold'>
                <ChatBubbleOutlineIcon sx={{ mr: 1 }} />
                Tus Prácticas
              </Typography>
              <IconButton
                aria-label='Cerrar lista de prácticas'
                onClick={() => setDrawerOpen(false)}
              >
                <CloseIcon />
              </IconButton>
            </Box>
            {renderPracticeList()}
          </Box>
        </Drawer>

        <Box sx={{ height: 80 }} />
      </>
    );
  }

  return (
    <Box
      sx={{
        marginTop: '10%',
        width: '100%',
        maxWidth: 700,
        mx: 'auto',
        p: { xs: 1, sm: 2 },
      }}
    >
      <Typography variant='h6' fontWeight='bold' mb={2} color=' #9966cc'>
        <ChatBubbleOutlineIcon sx={{ mr: 1 }} />
        Tus Prácticas
      </Typography>

      {renderPracticeList()}

      {totalPages > 1 && (
        <Box display='flex' justifyContent='center' mt={3}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, value) => setPage(value)}
            size='medium'
            color='primary'
            shape='rounded'
          />
        </Box>
      )}
    </Box>
  );
};

export default PracticeTree;
