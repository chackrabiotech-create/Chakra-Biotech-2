import { apiRequest, setToken, removeToken } from './config';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  token: string;
  message: string;
}

export interface VerifyResponse {
  success: boolean;
  admin: {
    email: string;
  };
}

export const authApi = {
  // Admin login
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await apiRequest('/admin/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (response.success && response.token) {
      setToken(response.token);
    }
    
    return response;
  },

  // Verify token
  verify: async (): Promise<VerifyResponse> => {
    return await apiRequest('/admin/verify');
  },

  // Logout
  logout: () => {
    removeToken();
  },
};
