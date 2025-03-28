export interface AuthTokens {
  accessToken: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role?: string;
}