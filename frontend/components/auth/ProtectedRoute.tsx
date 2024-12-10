"use client"
import React, { ReactNode, useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/landing');
    }
  }, [isAuthenticated, isLoading, router]);

  // Show nothing while loading
  if (isLoading) {
    return null;
  }

  // Show children only if authenticated
  return isAuthenticated ? <>{children}</> : null;
};

export default ProtectedRoute;