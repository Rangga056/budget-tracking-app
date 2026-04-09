'use client';

import { createTheme, alpha } from '@mui/material/styles';

// "Architectural Ledger" Design System — refined
const theme = createTheme({
  palette: {
    primary: {
      main: '#0058be',
      light: '#2170e4',
      dark: '#004395',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#006c49',
      light: '#4edea3',
      dark: '#005236',
      contrastText: '#ffffff',
    },
    error: {
      main: '#b90538',
      light: '#dc2c4f',
      dark: '#93000a',
      contrastText: '#ffffff',
    },
    background: {
      default: '#faf8ff',
      paper: '#ffffff',
    },
    text: {
      primary: '#131b2e',
      secondary: '#424754',
      disabled: '#9ea3b0',
    },
    divider: 'rgba(194, 198, 214, 0.12)',
    action: {
      hover: 'rgba(0, 88, 190, 0.04)',
      selected: 'rgba(0, 88, 190, 0.08)',
      focus: 'rgba(0, 88, 190, 0.12)',
    },
  },
  typography: {
    fontFamily: '"Inter", sans-serif',
    h1: {
      fontSize: '3.5rem',
      fontWeight: 900,
      lineHeight: 1.05,
      letterSpacing: '-0.03em',
    },
    h2: {
      fontSize: '2.5rem',
      fontWeight: 800,
      lineHeight: 1.1,
      letterSpacing: '-0.02em',
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 700,
      lineHeight: 1.25,
      letterSpacing: '-0.01em',
    },
    h4: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.35,
    },
    h5: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: '0.9375rem',
      fontWeight: 600,
      lineHeight: 1.45,
    },
    body1: {
      fontSize: '0.9375rem',
      fontWeight: 400,
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.8125rem',
      fontWeight: 400,
      lineHeight: 1.55,
    },
    caption: {
      fontSize: '0.6875rem',
      fontWeight: 600,
      lineHeight: 1.6,
      letterSpacing: '0.08em',
    },
    overline: {
      fontSize: '0.6875rem',
      fontWeight: 700,
      lineHeight: 1.6,
      letterSpacing: '0.12em',
      textTransform: 'uppercase' as const,
    },
    button: {
      textTransform: 'none' as const,
      fontWeight: 600,
      letterSpacing: '0.01em',
    },
  },
  shape: {
    borderRadius: 14,
  },
  shadows: [
    'none',
    '0px 2px 8px rgba(19, 27, 46, 0.06)',     // 1 — card
    '0px 4px 16px rgba(19, 27, 46, 0.07)',     // 2
    '0px 4px 16px rgba(19, 27, 46, 0.08)',     // 3
    '0px 8px 24px rgba(19, 27, 46, 0.09)',     // 4
    '0px 8px 32px rgba(19, 27, 46, 0.10)',     // 5 — float
    '0px 8px 32px rgba(19, 27, 46, 0.10)',
    '0px 8px 32px rgba(19, 27, 46, 0.10)',
    '0px 16px 40px rgba(19, 27, 46, 0.12)',    // 8 — modal
    '0px 16px 40px rgba(19, 27, 46, 0.12)',
    '0px 16px 40px rgba(19, 27, 46, 0.12)',
    '0px 16px 40px rgba(19, 27, 46, 0.12)',
    '0px 16px 48px rgba(19, 27, 46, 0.14)',
    '0px 16px 48px rgba(19, 27, 46, 0.14)',
    '0px 24px 64px rgba(19, 27, 46, 0.14)',
    '0px 24px 64px rgba(19, 27, 46, 0.14)',
    '0px 24px 64px rgba(19, 27, 46, 0.14)',
    '0px 24px 64px rgba(19, 27, 46, 0.14)',
    '0px 24px 64px rgba(19, 27, 46, 0.14)',
    '0px 24px 64px rgba(19, 27, 46, 0.14)',
    '0px 24px 64px rgba(19, 27, 46, 0.14)',
    '0px 24px 64px rgba(19, 27, 46, 0.14)',
    '0px 24px 64px rgba(19, 27, 46, 0.14)',
    '0px 24px 64px rgba(19, 27, 46, 0.14)',
    '0px 32px 80px rgba(19, 27, 46, 0.16)',
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#faf8ff',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          border: 'none',
          boxShadow: '0px 2px 12px rgba(19, 27, 46, 0.06)',
          backgroundImage: 'none',
        },
      },
      defaultProps: {
        elevation: 0,
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          '&:last-child': { paddingBottom: 'inherit' },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '10px 22px',
          fontSize: '0.875rem',
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'all 200ms cubic-bezier(0.0, 0.0, 0.2, 1)',
          letterSpacing: '0.01em',
        },
        sizeSmall: {
          borderRadius: 10,
          padding: '6px 14px',
          fontSize: '0.8125rem',
        },
        sizeLarge: {
          borderRadius: 14,
          padding: '14px 28px',
          fontSize: '0.9375rem',
          fontWeight: 700,
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #0058be 0%, #2170e4 100%)',
          boxShadow: '0 1px 4px rgba(0, 88, 190, 0.2)',
          '&:hover': {
            background: 'linear-gradient(135deg, #004395 0%, #0058be 100%)',
            boxShadow: '0 4px 16px rgba(0, 88, 190, 0.32)',
          },
          '&:active': {
            boxShadow: '0 1px 4px rgba(0, 88, 190, 0.2)',
          },
        },
        outlinedPrimary: {
          borderColor: 'rgba(0, 88, 190, 0.25)',
          '&:hover': {
            borderColor: 'rgba(0, 88, 190, 0.5)',
            backgroundColor: 'rgba(0, 88, 190, 0.04)',
          },
        },
        text: {
          '&:hover': {
            backgroundColor: 'rgba(0, 88, 190, 0.05)',
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
      },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            backgroundColor: '#ffffff',
            fontSize: '0.9375rem',
            transition: 'box-shadow 200ms ease',
            '& fieldset': {
              borderColor: 'rgba(194, 198, 214, 0.4)',
              transition: 'border-color 150ms ease',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(194, 198, 214, 0.8)',
            },
            '&.Mui-focused': {
              boxShadow: '0 0 0 3px rgba(0, 88, 190, 0.1)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#0058be',
              borderWidth: '1.5px',
            },
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#0058be',
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 24,
          backdropFilter: 'blur(24px)',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          boxShadow: '0px 24px 64px rgba(19, 27, 46, 0.18)',
          backgroundImage: 'none',
        },
        backdrop: {
          backdropFilter: 'blur(4px)',
          backgroundColor: 'rgba(19, 27, 46, 0.3)',
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontSize: '1.0625rem',
          fontWeight: 700,
          letterSpacing: '-0.01em',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600,
          fontSize: '0.75rem',
          letterSpacing: '0.01em',
          height: 28,
          transition: 'all 150ms ease',
        },
        sizeSmall: {
          height: 22,
          fontSize: '0.6875rem',
          borderRadius: 6,
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          borderRadius: 18,
          boxShadow: '0px 8px 32px rgba(19, 27, 46, 0.14)',
          '&:hover': {
            boxShadow: '0px 12px 40px rgba(19, 27, 46, 0.18)',
          },
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          transition: 'all 150ms ease',
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          borderRadius: '10px !important',
          border: 'none',
          fontWeight: 600,
          fontSize: '0.875rem',
          textTransform: 'none',
          padding: '8px 16px',
          color: '#424754',
          transition: 'all 150ms ease',
          '&.Mui-selected': {
            backgroundColor: '#0058be',
            color: '#ffffff',
            '&:hover': {
              backgroundColor: '#004395',
            },
          },
          '&:hover': {
            backgroundColor: 'rgba(0, 88, 190, 0.06)',
          },
        },
      },
    },
    MuiToggleButtonGroup: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(194, 198, 214, 0.15)',
          borderRadius: 12,
          padding: '3px',
          gap: '3px',
          border: 'none',
          '& .MuiToggleButtonGroup-grouped': {
            border: 'none',
            '&:not(:first-of-type)': {
              marginLeft: 0,
              borderLeft: 'none',
              borderRadius: '10px !important',
            },
            '&:first-of-type': {
              borderRadius: '10px !important',
            },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          fontSize: '0.875rem',
          fontWeight: 500,
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          '& .MuiSwitch-switchBase.Mui-checked': {
            color: '#0058be',
          },
          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
            backgroundColor: '#0058be',
          },
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          height: 4,
        },
      },
    },
    MuiSkeleton: {
      defaultProps: {
        animation: 'wave',
      },
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: '#131b2e',
          fontSize: '0.75rem',
          fontWeight: 500,
          borderRadius: 8,
          padding: '6px 10px',
        },
      },
    },
  },
});

export default theme;
