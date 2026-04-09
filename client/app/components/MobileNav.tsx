'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Box, Typography } from '@mui/material';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';

const NAV_ITEMS = [
  { label: 'Home', href: '/dashboard', icon: HomeRoundedIcon },
  { label: 'Activity', href: '/transactions', icon: ReceiptLongRoundedIcon },
  { label: 'Add', href: '/transactions/new', icon: AddRoundedIcon, isFab: true },
  { label: 'Categories', href: '/categories', icon: CategoryRoundedIcon },
  { label: 'Settings', href: '/settings', icon: SettingsRoundedIcon },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <Box
      component="nav"
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        display: { xs: 'flex', md: 'none' },
        justifyContent: 'space-around',
        alignItems: 'center',
        pt: 1,
        pb: 'max(env(safe-area-inset-bottom, 8px), 10px)',
        px: 2,
        zIndex: 1100,
        backgroundColor: 'rgba(255, 255, 255, 0.88)',
        backdropFilter: 'blur(32px) saturate(1.8)',
        WebkitBackdropFilter: 'blur(32px) saturate(1.8)',
        borderTop: '1px solid rgba(194, 198, 214, 0.2)',
        boxShadow: '0 -4px 24px rgba(19, 27, 46, 0.06)',
      }}
    >
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href || (item.href !== '/transactions/new' && item.href !== '/' && pathname.startsWith(item.href));

        if (item.isFab) {
          return (
            <Box
              key={item.href}
              component={Link}
              href={item.href}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textDecoration: 'none',
                mt: -2.5,
              }}
            >
              <Box
                sx={{
                  width: 50,
                  height: 50,
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #0058be 0%, #2170e4 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  boxShadow: '0 8px 24px rgba(0, 88, 190, 0.38)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: '0 12px 32px rgba(0, 88, 190, 0.45)',
                  },
                  '&:active': {
                    transform: 'scale(0.96)',
                  },
                }}
              >
                <item.icon sx={{ fontSize: 24 }} />
              </Box>
              <Typography
                sx={{
                  fontSize: '0.62rem',
                  fontWeight: 600,
                  color: '#0058be',
                  letterSpacing: '0.02em',
                  mt: 0.35,
                }}
              >
                {item.label}
              </Typography>
            </Box>
          );
        }

        return (
          <Box
            key={item.href}
            component={Link}
            href={item.href}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 0.3,
              textDecoration: 'none',
              color: isActive ? '#0058be' : '#9ea3b0',
              transition: 'color 0.18s ease',
              minWidth: 44,
              position: 'relative',
              py: 0.25,
            }}
          >
            {/* Active indicator dot */}
            <Box
              sx={{
                position: 'absolute',
                top: -2,
                width: 4,
                height: 4,
                borderRadius: '50%',
                backgroundColor: '#0058be',
                transition: 'opacity 0.2s ease, transform 0.2s ease',
                opacity: isActive ? 1 : 0,
                transform: isActive ? 'scale(1)' : 'scale(0)',
              }}
            />
            <Box
              sx={{
                p: 0.75,
                borderRadius: '10px',
                backgroundColor: isActive ? 'rgba(0, 88, 190, 0.08)' : 'transparent',
                transition: 'background-color 0.18s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <item.icon sx={{ fontSize: 21 }} />
            </Box>
            <Typography
              sx={{
                fontSize: '0.65rem',
                fontWeight: isActive ? 700 : 500,
                letterSpacing: '0.01em',
                lineHeight: 1,
              }}
            >
              {item.label}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
}
