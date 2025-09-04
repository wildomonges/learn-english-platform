import React from 'react';
import { Box, Typography, Card, CardContent, Button } from '@mui/material';
import type { Practice } from '../../interfaces/Practice';

interface PracticeListProps {
  practices: Practice[];
  isMobile?: boolean;
  onCloseDrawer?: () => void;
}

const PracticeList: React.FC<PracticeListProps> = ({
  practices,
  isMobile = false,
  onCloseDrawer,
}) => {
  if (practices.length === 0) {
    return (
      <Box p={2} textAlign='center'>
        <Typography color='text.secondary'>No tienes prácticas aún.</Typography>
      </Box>
    );
  }

  return (
    <Box display='flex' flexDirection='column' gap={2}>
      {practices.map((practice) => (
        <Card
          key={practice.id}
          sx={{
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          <CardContent>
            <Typography variant='h6' fontWeight='bold'>
              {practice.name}
            </Typography>
            <Typography
              variant='body2'
              color='text.secondary'
              mb={2}
            ></Typography>
            <Button
              variant='contained'
              size='small'
              sx={{ backgroundColor: '#9966cc', color: '#fff' }}
              onClick={() => {
                console.log(`Abrir práctica ${practice.id}`);
                if (isMobile && onCloseDrawer) {
                  onCloseDrawer();
                }
              }}
            >
              Abrir práctica
            </Button>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default PracticeList;
