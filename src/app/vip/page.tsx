'use client';

import { useState, useEffect, Suspense } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { VipLogin } from '@/components/vip/VipLogin';
import { VipDashboard } from '@/components/vip/VipDashboard';
import { VipJoin } from '@/components/vip/VipJoin';
import { useSearchParams } from 'next/navigation';

function VipContent() {
  const { user, isLoading: authLoading } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    const action = searchParams.get('action');
    if (action === 'join') {
      setShowJoin(true);
    } else if (action === 'login') {
      setShowLogin(true);
    } else if (!user) {
      setShowLogin(true);
    }
  }, [searchParams, user]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-yellow-900 to-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  if (showJoin) {
    return <VipJoin />;
  }

  if (showLogin || !user) {
    return <VipLogin onSuccess={() => setShowLogin(false)} />;
  }

  return <VipDashboard />;
}

export default function VipPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-yellow-900 to-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
      </div>
    }>
      <VipContent />
    </Suspense>
  );
}