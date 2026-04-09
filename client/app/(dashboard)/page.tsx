'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoadingScreen from '../components/LoadingScreen';

/**
 * This page was causing route shadowing conflicts with app/page.tsx.
 * We are moving the dashboard to /dashboard.
 * Legacy visitors to / will be handled by app/page.tsx.
 * Legacy visitors who somehow hit this specific internal route node will be moved to /dashboard.
 */
export default function DashboardRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard');
  }, [router]);

  return <LoadingScreen />;
}
