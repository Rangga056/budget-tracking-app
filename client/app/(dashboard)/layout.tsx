'use client';

import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../components/Sidebar';
import MobileNav from '../components/MobileNav';
import SyncStatusBar from '../components/SyncStatusBar';
import BiometricOverlay from '../components/BiometricOverlay';
import { NetworkProvider } from '../components/NetworkProvider';
import api from '../lib/api';
import { getPreference } from '../lib/db';
import LoadingScreen from '../components/LoadingScreen';
import GlobalAddButton from '../components/GlobalAddButton';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isBiometricVerified, setIsBiometricVerified] = useState(false);
  const [isBiometricEnabled, setIsBiometricEnabled] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        await api.get('/api/me');
        setIsAuthenticated(true);
        
        // Check biometric preference
        const biometricEnabled = await getPreference('biometrics', false);
        setIsBiometricEnabled(biometricEnabled);
        if (!biometricEnabled) {
          setIsBiometricVerified(true);
        }
      } catch {
        router.replace('/auth/login');
      }
    }
    checkAuth();
  }, [router]);

  if (!isAuthenticated) {
    return <LoadingScreen />;
  }

  // Show biometric overlay if enabled and not yet verified this session
  if (isBiometricEnabled && !isBiometricVerified) {
    return <BiometricOverlay onSuccess={() => setIsBiometricVerified(true)} />;
  }

  return (
    <NetworkProvider>
      <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f7f8fc' }}>
        {/* Desktop Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <Box
          component="main"
          className="dashboard-content"
          sx={{
            flex: 1,
            minHeight: '100vh',
            px: { xs: 2, sm: 3, md: 4, lg: 5 },
            pt: { xs: 2.5, md: 4 },
            pb: { xs: 12, md: 5 }, // extra bottom for mobile nav + fab
            maxWidth: { md: 'calc(100% - 256px)' },
            overflowX: 'hidden',
          }}
        >
          {children}
        </Box>

        {/* Mobile Bottom Nav */}
        <MobileNav />

        {/* Floating Sync Status */}
        <SyncStatusBar />

        {/* Global Add SpeedDial */}
        <GlobalAddButton />
      </Box>
    </NetworkProvider>
  );
}
