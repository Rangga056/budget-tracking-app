'use client';

import { Box, Typography } from '@mui/material';
import { keyframes } from '@mui/system';

const float = keyframes`
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(2deg); }
  100% { transform: translateY(0px) rotate(0deg); }
`;

const pulse = keyframes`
  0% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.1); opacity: 1; }
  100% { transform: scale(1); opacity: 0.8; }
`;

const slideIn = keyframes`
  from { clip-path: inset(0 100% 0 0); }
  to { clip-path: inset(0 0 0 0); }
`;

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

export default function LoadingScreen() {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#ffffff',
        overflow: 'hidden',
      }}
    >
      {/* Background Decorative Elements */}
      <Box
        sx={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          opacity: 0.4,
          background: `radial-gradient(circle at 20% 20%, #e0f2fe 0%, transparent 50%),
                       radial-gradient(circle at 80% 80%, #fef3c7 0%, transparent 50%),
                       radial-gradient(circle at 50% 50%, #eff6ff 0%, transparent 70%)`,
          filter: 'blur(80px)',
        }}
      />

      {/* Main Logo Container */}
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          animation: `${float} 6s infinite ease-in-out`,
          zIndex: 1,
        }}
      >
        {/* Abstract Liquid SVG Logo */}
        <Box sx={{ position: 'relative', mb: 4 }}>
          <svg width="120" height="120" viewBox="0 0 100 100" fill="none">
            {/* Outer Ring */}
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="#0058be"
              strokeWidth="2"
              strokeDasharray="15 15"
              style={{ animation: `${rotate} 10s linear infinite` }}
            />
            {/* Inner Liquid Wave */}
            <path
              d="M30 50C30 38.9543 38.9543 30 50 30C61.0457 30 70 38.9543 70 50C70 61.0457 61.0457 70 50 70C38.9543 70 30 61.0457 30 50Z"
              fill="url(#liquid-grad)"
              style={{ animation: `${pulse} 3s infinite ease-in-out` }}
            />
            <defs>
              <linearGradient id="liquid-grad" x1="30" y1="30" x2="70" y2="70" gradientUnits="userSpaceOnUse">
                <stop stopColor="#0058be" />
                <stop offset="1" stopColor="#3084f2" />
              </linearGradient>
            </defs>
            {/* Floating Coins/Dots */}
            <circle cx="25" cy="25" r="4" fill="#fbbf24" style={{ animation: `${pulse} 2s infinite ease-in-out` }} />
            <circle cx="75" cy="35" r="3" fill="#34d399" style={{ animation: `${pulse} 2.5s infinite ease-in-out` }} />
          </svg>
        </Box>

        <Typography
          variant="h3"
          sx={{
            fontWeight: 900,
            color: '#131b2e',
            letterSpacing: '-0.02em',
            fontSize: { xs: '2rem', md: '2.5rem' },
            mb: 1,
          }}
        >
          Budget<span style={{ color: '#0058be' }}>Flow</span>
        </Typography>

        <Box sx={{ position: 'relative', width: 200, height: 4, bgcolor: '#f1f5f9', borderRadius: 2, overflow: 'hidden' }}>
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              height: '100%',
              width: '100%',
              bgcolor: '#0058be',
              animation: `${slideIn} 2.5s infinite cubic-bezier(0.65, 0.05, 0.36, 1)`,
            }}
          />
        </Box>
        
        <Typography
          variant="body2"
          sx={{
            mt: 3,
            color: '#64748b',
            fontWeight: 500,
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            fontSize: '0.7rem',
          }}
        >
          Analyzing Financial Data
        </Typography>
      </Box>

      {/* Footer Branding */}
      <Box sx={{ position: 'absolute', bottom: 40, color: '#94a3b8', fontSize: '0.8rem', fontWeight: 500 }}>
        Secure Portfolio Access
      </Box>
    </Box>
  );
}
