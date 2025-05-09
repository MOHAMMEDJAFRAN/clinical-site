// hooks/useAuth.js
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export const useAuth = (requiredRole) => {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));
      
      if (!token || !user) {
        router.push('/login');
        return;
      }

      if (requiredRole && user.role !== requiredRole) {
        router.push('/unauthorized');
      }
    };

    checkAuth();
  }, [router, requiredRole]);
};