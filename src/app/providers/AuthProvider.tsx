/* eslint-disable react-hooks/exhaustive-deps */
import { useAuthStore } from '@features/auth/stores/useAuthStore';
import React, { createContext, useContext, useEffect, useState } from 'react';

type AuthContextType = {
  isAuthenticated: boolean;
  user: any;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, accessToken, logout, restoreSession } = useAuthStore();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Tự động khôi phục session khi mở app
    (async () => {
      await restoreSession?.();
      setIsReady(true);
    })();
  }, []);

  if (!isReady) return null; // Có thể hiển thị SplashScreen ở đây

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!accessToken,
        user,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
