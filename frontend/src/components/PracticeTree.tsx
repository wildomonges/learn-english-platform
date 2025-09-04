import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Drawer,
  IconButton,
  useMediaQuery,
  CircularProgress,
  Pagination,
} from '@mui/material';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import CloseIcon from '@mui/icons-material/Close';
import { useAuth } from '../context/AuthContext';
import type { Practice } from '../interfaces/Practice';
import PracticeList from './mobile/PracticeList';
import { fetchUserPractices } from '../api/practicesAPI';

const ITEMS_PER_PAGE = 3;

const PracticeTree: React.FC = () => {
  const { user } = useAuth();
  const [practices, setPractices] = useState<Practice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const isMobile = useMediaQuery('(max-width:768px)');

  if (!user) return;

  const fetchPractices = async () => {
    setLoading(true);
    try {
      const res = await fetchUserPractices(user.id);
      setPractices(res);
    } catch (err) {
      setError((err as Error).message || 'Error inesperado');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchPractices();
  }, [user]);

  const totalPages = Math.ceil(practices.length / ITEMS_PER_PAGE);
  const paginatedPractices = practices.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  if (loading)
    return (
      <Box p={4} textAlign='center'>
        <CircularProgress />
        <Typography mt={2}>Cargando tus prácticas...</Typography>
      </Box>
    );

  if (error)
    return (
      <Box p={4} textAlign='center'>
        <Typography color='error'>❌ {error}</Typography>
        <Button
          variant='outlined'
          sx={{ mt: 2 }}
          onClick={() => window.location.reload()}
        >
          Reintentar
        </Button>
      </Box>
    );

  return (
    <Box
      sx={{
        mt: '10%',
        width: '100%',
        maxWidth: 700,
        mx: 'auto',
        p: { xs: 1, sm: 2 },
      }}
    >
      <Typography variant='h6' fontWeight='bold' mb={2} color='#9966cc'>
        <ChatBubbleOutlineIcon sx={{ mr: 1 }} /> Tus Prácticas
      </Typography>

      {isMobile ? (
        <>
          {!drawerOpen && (
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
              }}
            >
              Mis Prácticas
            </Button>
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
                  <ChatBubbleOutlineIcon sx={{ mr: 1 }} /> Tus Prácticas
                </Typography>
                <IconButton
                  aria-label='Cerrar lista de prácticas'
                  onClick={() => setDrawerOpen(false)}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
              <PracticeList
                practices={practices}
                isMobile
                onCloseDrawer={() => setDrawerOpen(false)}
              />
            </Box>
          </Drawer>
          <Box sx={{ height: 80 }} />
        </>
      ) : (
        <>
          <PracticeList practices={paginatedPractices} />
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
        </>
      )}
    </Box>
  );
};

export default PracticeTree;
