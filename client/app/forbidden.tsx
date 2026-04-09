'use client';

import Link from 'next/link';
import { Box, Typography, Button } from '@mui/material';

export default function ForbiddenPage() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#faf8ff',
        px: 3,
        textAlign: 'center',
      }}
    >
      <Typography variant="h1" sx={{ fontSize: { xs: '6rem', md: '10rem' }, fontWeight: 800, color: '#0058be', opacity: 0.1, position: 'absolute' }}>
        403
      </Typography>
      <Box sx={{ zIndex: 1, position: 'relative' }}>
        <Typography variant="h2" sx={{ mb: 2, color: '#131b2e', fontWeight: 700 }}>
          Access Denied
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, color: '#727785', maxWidth: 400 }}>
          You do not have permission to access this page. Please log in with the correct credentials or contact support if you believe this is an error.
        </Typography>
        <Button
          component={Link}
          href="/auth/login"
          variant="contained"
          sx={{
            px: 4,
            py: 1.5,
            background: 'linear-gradient(135deg, #0058be, #3084f2)',
            borderRadius: 2,
            textTransform: 'none',
            fontSize: '1rem',
            fontWeight: 600,
          }}
        >
          Return to Login
        </Button>
      </Box>
    </Box>
  );
}
