import axiosInstance from '../axiosInstance';
import { jwtDecode } from 'jwt-decode';
import type { AuthTokens } from './types';

interface LoginCredentials {
  email: string;
  password: string;
}

interface SignupCredentials {
  username: string;
  email: string;
  password: string;
}

interface AuthResponse {
  tokens: AuthTokens;
  user: Record<string, unknown>; // ou um tipo mais específico se souber a estrutura do `user`
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<Record<string, unknown>> {
    try {
      const { data } = await axiosInstance.post<AuthResponse>('/auth/session', credentials, {
        withCredentials: true,
      });
      this.setTokens(data.tokens);
      return data.user;
    } catch (error) {
      throw new Error(this.extractErrorMessage(error));
    }
  }

  async signup(credentials: SignupCredentials): Promise<Record<string, unknown>> {
    try {
      const { data } = await axiosInstance.post<AuthResponse>('/users', credentials);
      this.setTokens(data.tokens);
      return data.user;
    } catch (error) {
      throw new Error(this.extractErrorMessage(error));
    }
  }

  logout(): void {
    this.removeTokens();
  }

  private setTokens(tokens: AuthTokens): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(tokens));
    }
  }

  private removeTokens(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
    }
  }

  isTokenExpired(token: string): boolean {
    try {
      const decoded = jwtDecode<{ exp: number }>(token);
      return decoded.exp < Date.now() / 1000;
    } catch {
      return true;
    }
  }

  async refreshAccessToken(): Promise<string | null> {
    try {
      const { data } = await axiosInstance.post<{ tokens: AuthTokens }>('/auth/refresh');
      this.setTokens(data.tokens);
      return data.tokens.accessToken;
    } catch {
      this.logout();
      return null;
    }
  }

  private extractErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }
    if (typeof error === 'object' && error !== null && 'response' in error) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      return axiosError.response?.data?.message || 'An error occurred';
    }
    return 'An unknown error occurred';
  }
}

export default new AuthService();
