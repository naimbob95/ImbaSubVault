import Cookies from 'js-cookie';
import api from '@/lib/api';
import { User, AuthResponse, LoginCredentials, RegisterCredentials } from '@/types';

export class AuthService {
  private static instance: AuthService;
  private currentUser: User | null = null;
  private readonly TOKEN_KEY = 'token';
  private readonly TOKEN_EXPIRY_DAYS = 1;

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  public async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/login', credentials);
      await this.handleAuthSuccess(response.data);
      return response.data;
    } catch (error) {
      this.handleAuthError(error);
      throw error;
    }
  }

  public async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/register', credentials);
      await this.handleAuthSuccess(response.data);
      return response.data;
    } catch (error) {
      this.handleAuthError(error);
      throw error;
    }
  }

  public async forgotPassword(email: string): Promise<void> {
    try {
      await api.post('/auth/forgot-password', { email });
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  }

  public async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      await api.post('/auth/reset-password', { token, password: newPassword });
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  }

  public async getProfile(): Promise<User> {
    try {
      const response = await api.get<User>('/users/profile');
      this.currentUser = response.data;
      return response.data;
    } catch (error) {
      this.handleAuthError(error);
      throw error;
    }
  }

  public logout(): void {
    this.clearAuthData();
  }

  public getCurrentUser(): User | null {
    return this.currentUser;
  }

  public isAuthenticated(): boolean {
    return !!this.getToken() && !!this.currentUser;
  }

  public getToken(): string | undefined {
    return Cookies.get(this.TOKEN_KEY);
  }

  private async handleAuthSuccess(authResponse: AuthResponse): Promise<void> {
    this.setToken(authResponse.access_token);
    await this.fetchAndSetCurrentUser();
  }

  private handleAuthError(error: unknown): void {
    console.error('Authentication error:', error);
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { status?: number } };
      if (axiosError.response?.status === 401) {
        this.clearAuthData();
      }
    }
  }

  private setToken(token: string): void {
    Cookies.set(this.TOKEN_KEY, token, { expires: this.TOKEN_EXPIRY_DAYS });
  }

  private clearAuthData(): void {
    Cookies.remove(this.TOKEN_KEY);
    this.currentUser = null;
  }

  private async fetchAndSetCurrentUser(): Promise<void> {
    try {
      this.currentUser = await this.getProfile();
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      this.clearAuthData();
    }
  }


  protected validateToken(): boolean {
    const token = this.getToken();
    if (!token) return false;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp > currentTime;
    } catch {
      return false;
    }
  }

  public async refreshAuth(): Promise<void> {
    const token = this.getToken();
    if (token && this.validateToken()) {
      try {
        await this.fetchAndSetCurrentUser();
      } catch {
        // Just clear auth data, don't call logout() to avoid redirects
        this.clearAuthData();
      }
    } else {
      // Just clear auth data, don't call logout() to avoid redirects
      this.clearAuthData();
    }
  }
}