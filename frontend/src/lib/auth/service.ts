import axiosInstance from '@/lib/axiosInstance';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

interface LoginCredentials {
  email: string;
  password: string;
}

interface SignupCredentials {
  username: string;
  email: string;
  password: string;
}

interface ApiLoginResponse {
  token: string;
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<Record<string, unknown>> {
    try {
      const { data } = await axiosInstance.post<ApiLoginResponse>('/auth/session', credentials, {
        withCredentials: true,
      });
      
      const decodedToken = jwtDecode<{
        sub: string;
        role: string;
      }>(data.token);

      this.setTokens({ accessToken: data.token });

      return {
        id: decodedToken.sub,
        role: decodedToken.role
      };
    } catch (error) {
      console.error('Login error:', error);
      throw new Error(this.extractErrorMessage(error));
    }
  }

  async signup(credentials: SignupCredentials): Promise<Record<string, unknown>> {
    try {
      const { data } = await axiosInstance.post<ApiLoginResponse>('/users', credentials);
      
      const decodedToken = jwtDecode<{
        sub: string;
        role: string;
      }>(data.token);

      this.setTokens({ accessToken: data.token });

      return {
        id: decodedToken.sub,
        role: decodedToken.role
      };
    } catch (error) {
      console.error('Signup error:', error);
      throw new Error(this.extractErrorMessage(error));
    }
  }

  logout(): void {
    this.removeTokens();
  }

  private setTokens(tokens: { accessToken: string }): void {
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
      const { data } = await axiosInstance.post<{ token: string }>('/auth/refresh');
      
      this.setTokens({ accessToken: data.token });
      
      return data.token;
    } catch {
      this.logout();
      return null;
    }
  }

  private extractErrorMessage(error: unknown): string {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        return error.response.data?.message 
          || error.response.data?.error 
          || `Error ${error.response.status}: ${error.response.statusText}`;
      } else if (error.request) {
        return 'No response received from server';
      }
    }

    if (error instanceof Error) {
      return error.message;
    }

    return 'An unexpected error occurred';
  }
}

const authService = new AuthService();
export default authService;