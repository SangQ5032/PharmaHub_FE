export interface User {
  id: string;
  name: string;
  email: string;
}

// export interface AuthState {
// user: User | null;
// token?: string | null;
// loading: boolean;
// error?: string | null;
// }

export interface LoginBody {
  email: string;
  password: string;
}

export interface LoginData {
  accessToken: string;
  refreshToken?: string;
  user?: any; // sẽ refine sau
}

export interface SendOTPBody {
  phone: string;
}

export interface SendOTPResponse {
  success: boolean;
  message: string;
  data: {
    expiresIn: number;
  };
}

export interface VerifyOTPBody {
  phone: string;
  otp: string;
  sessionId?: string; // Nếu backend cần sessionId
}

export interface VerifyOTPResponse {
  success: boolean;
  accessToken?: string;
  refreshToken?: string;
  user?: any;
  message?: string;
}

export interface VerifyFirebaseTokenBody {
  idToken: string;
}

export interface VerifyFirebaseTokenResponse {
  success: boolean;
  accessToken?: string;
  refreshToken?: string;
  user?: any;
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
