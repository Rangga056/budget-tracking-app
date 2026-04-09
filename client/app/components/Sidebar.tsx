'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Box, Typography, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider } from '@mui/material';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: DashboardRoundedIcon },
  { label: 'Transactions', href: '/transactions', icon: ReceiptLongRoundedIcon },
  { label: 'Categories', href: '/categories', icon: CategoryRoundedIcon },
  { label: 'Settings', href: '/settings', icon: SettingsRoundedIcon },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <Box
      component="nav"
      sx={{
        width: 256,
        minHeight: '100vh',
        backgroundColor: '#ffffff',
        borderRight: '1px solid rgba(194, 198, 214, 0.35)',
        display: { xs: 'none', md: 'flex' },
        flexDirection: 'column',
        py: 3,
        px: 1.5,
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      {/* Brand */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 1.5, mb: 5 }}>
        <Box
          sx={{
            width: 34,
            height: 34,
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #0058be 0%, #2170e4 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            flexShrink: 0,
            boxShadow: '0 4px 12px rgba(0, 88, 190, 0.25)',
          }}
        >
          <AccountBalanceWalletRoundedIcon sx={{ fontSize: 17 }} />
        </Box>
        <Box>
          <Typography
            sx={{
              fontWeight: 800,
              fontSize: '0.9375rem',
              letterSpacing: '-0.02em',
              color: '#131b2e',
              lineHeight: 1,
            }}
          >
            BudgetFlow
          </Typography>
          <Typography sx={{ fontSize: '0.6rem', color: '#9ea3b0', letterSpacing: '0.08em', fontWeight: 600 }}>
            PERSONAL FINANCE
          </Typography>
        </Box>
      </Box>

      {/* Section Label */}
      <Typography
        sx={{
          fontSize: '0.6rem',
          fontWeight: 700,
          letterSpacing: '0.12em',
          color: '#b0b5c4',
          px: 1.5,
          mb: 1,
        }}
      >
        MENU
      </Typography>

      {/* Nav Items */}
      <List sx={{ display: 'flex', flexDirection: 'column', gap: 0.25, flex: 1, p: 0 }}>
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <ListItem key={item.href} disablePadding>
              <ListItemButton
                component={Link}
                href={item.href}
                sx={{
                  borderRadius: '12px',
                  py: 1.1,
                  px: 1.5,
                  position: 'relative',
                  color: isActive ? '#0058be' : '#5a6072',
                  backgroundColor: isActive ? 'rgba(0, 88, 190, 0.08)' : 'transparent',
                  '&:hover': {
                    backgroundColor: isActive
                      ? 'rgba(0, 88, 190, 0.10)'
                      : 'rgba(19, 27, 46, 0.04)',
                    color: isActive ? '#0058be' : '#131b2e',
                  },
                  transition: 'all 0.18s ease',
                  // Left indicator
                  '&::before': isActive
                    ? {
                        content: '""',
                        position: 'absolute',
                        left: 0,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: 3,
                        height: 22,
                        borderRadius: '0 4px 4px 0',
                        backgroundColor: '#0058be',
                      }
                    : {},
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 36,
                    color: 'inherit',
                    transition: 'transform 0.18s ease',
                  }}
                >
                  <item.icon sx={{ fontSize: 20 }} />
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    sx: {
                      fontSize: '0.875rem',
                      fontWeight: isActive ? 700 : 500,
                      letterSpacing: '-0.01em',
                    },
                  }}
                />
                {isActive && (
                  <FiberManualRecordIcon sx={{ fontSize: 6, color: '#0058be', opacity: 0.6 }} />
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* Bottom area */}
      <Box>
        <Divider sx={{ mb: 2, borderColor: 'rgba(194, 198, 214, 0.25)' }} />
        <Box
          sx={{
            px: 1.5,
            py: 1,
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: 1.25,
            cursor: 'default',
          }}
        >
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #e2e7ff, #c8d5ff)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 800, color: '#0058be' }}>B</Typography>
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              sx={{
                fontSize: '0.8rem',
                fontWeight: 700,
                color: '#131b2e',
                letterSpacing: '-0.01em',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              My Account
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box sx={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: '#006c49', flexShrink: 0 }} />
              <Typography sx={{ fontSize: '0.65rem', color: '#9ea3b0', fontWeight: 500 }}>
                Offline-First Sync
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
