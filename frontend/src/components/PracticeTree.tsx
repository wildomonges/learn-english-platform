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
  Slide,
} from '@mui/material';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import CloseIcon from '@mui/icons-material/Close';
import { useAuth } from '../context/AuthContext';
import type { Practice } from '../interfaces/Practice';
import PracticeList from './mobile/PracticeList';
import { fetchUserPractices } from '../api/practicesAPI';
import '../styles/PracticeTree.css';

const ITEMS_PER_PAGE = 3;

const PracticeTree: React.FC = () => {
  const { user } = useAuth();
  const [practices, setPractices] = useState<Practice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showButton, setShowButton] = useState(true);

  const isMobile = useMediaQuery('(max-width:768px)');

  const fetchPractices = async () => {
    if (!user) return;

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
    if (!user) return;
    fetchPractices();
  }, [user]);

  useEffect(() => {
    if (!isMobile) return;

    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      if (window.scrollY > lastScrollY + 10) {
        setShowButton(false);
      } else if (window.scrollY < lastScrollY - 10) {
        setShowButton(true);
      }
      lastScrollY = window.scrollY;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile]);

  if (!user) {
    return (
      <Box p={4} textAlign='center'>
        <CircularProgress />
        <Typography mt={2}>Cargando usuario...</Typography>
      </Box>
    );
  }

  const totalPages = Math.ceil(practices.length / ITEMS_PER_PAGE);
  const paginatedPractices = practices.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  if (loading)
    return (
      <Box
        p={4}
        textAlign='center'
        sx={{
          color: 'var(--text)',
          backgroundColor: 'var(--bg)',
          minHeight: '50vh',
        }}
      >
        <CircularProgress sx={{ color: 'var(--accent)' }} />
        <Typography mt={2}>Cargando tus prácticas...</Typography>
      </Box>
    );

  if (error)
    return (
      <Box p={4} textAlign='center' sx={{ color: 'var(--text)' }}>
        <Typography color='error'>❌ {error}</Typography>
        <Button
          variant='contained'
          onClick={() => window.location.reload()}
          sx={{
            mt: 2,
            backgroundColor: 'var(--accent)',
            '&:hover': { backgroundColor: 'rgba(56, 189, 248, 0.8)' },
          }}
        >
          Reintentar
        </Button>
      </Box>
    );

  return (
    <Box
      sx={{
        mt: { xs: 2, sm: '10%' },
        width: '100%',
        maxWidth: 700,
        mx: 'auto',
        p: { xs: 1, sm: 2 },
        position: 'relative',
        color: 'var(--text)',
        backgroundColor: 'var(--bg)',
      }}
    >
      {!isMobile && (
        <Typography
          variant='h6'
          fontWeight='bold'
          mb={2}
          sx={{ color: 'var(--accent)' }}
        >
          <ChatBubbleOutlineIcon sx={{ mr: 1 }} /> Tus Prácticas
        </Typography>
      )}

      {isMobile ? (
        <>
          <Slide
            direction='up'
            in={showButton && !drawerOpen}
            mountOnEnter
            unmountOnExit
          >
            <Button
              onClick={() => setDrawerOpen(true)}
              sx={{
                position: 'fixed',
                bottom: 20,
                right: 20,
                width: 60,
                height: 60,
                borderRadius: '50%',
                backgroundColor: 'var(--accent)',
                color: 'var(--text)',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                zIndex: 1000,
              }}
            >
              +
            </Button>
          </Slide>

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
                backgroundColor: 'var(--bg)',
                color: 'var(--text)',
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
                <Typography
                  variant='h6'
                  fontWeight='bold'
                  sx={{ color: 'var(--accent)' }}
                >
                  <ChatBubbleOutlineIcon sx={{ mr: 1 }} /> Tus Prácticas
                </Typography>
                <IconButton
                  onClick={() => setDrawerOpen(false)}
                  sx={{ color: 'var(--text)' }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>

              <PracticeList
                practices={practices}
                isMobile={true}
                setDrawerOpen={setDrawerOpen}
              />

              {totalPages > 1 && (
                <Box display='flex' justifyContent='center' mt={2} mb={2}>
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={(_, value) => setPage(value)}
                    size='medium'
                    sx={{
                      '& .MuiPaginationItem-root': { color: 'var(--text)' },
                      '& .Mui-selected': {
                        backgroundColor: 'var(--accent)',
                        color: 'var(--text)',
                      },
                    }}
                  />
                </Box>
              )}
            </Box>
          </Drawer>
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
                sx={{
                  '& .MuiPaginationItem-root': { color: 'var(--text)' },
                  '& .Mui-selected': {
                    backgroundColor: 'var(--accent)',
                    color: 'var(--text)',
                  },
                }}
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default PracticeTree;
