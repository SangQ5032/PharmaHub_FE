import React from 'react';
import { QueryProvider } from '@app/query/queryClient';
import { AuthProvider } from '@app/providers/AuthProvider';
import { PermissionProvider } from '@app/providers/PermissionProvider';

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryProvider>
      <PermissionProvider>
        <AuthProvider>{children}</AuthProvider>
      </PermissionProvider>
    </QueryProvider>
  );
};
