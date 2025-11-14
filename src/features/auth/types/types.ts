export interface User {
  id: string;
  name: string;
  email: string;
}

// Login với Firebase ID Token (cho phone auth)
export interface LoginFirebaseBody {
  idToken: string;
}

export interface VerifyFirebaseTokenResponse {
  success: boolean;
  data: {
    accessToken?: string;
    refreshToken?: string;
    user?: User;
  };
  message?: string;
}

export type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  user: any | null;

  // Actions
  setToken: (accessToken: string, refreshToken?: string) => Promise<void>;
  setUser: (user: any) => void;
  restoreSession: () => Promise<void>;
  logout: () => Promise<void>;
};
