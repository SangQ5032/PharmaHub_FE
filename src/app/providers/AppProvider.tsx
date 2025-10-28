import React from 'react';
import { QueryProvider } from '@app/query/queryClient';
import { AuthProvider } from '@app/providers/AuthProvider';

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryProvider>
      <AuthProvider>{children}</AuthProvider>
    </QueryProvider>
  );
};
