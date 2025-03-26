export interface User {
    id: string;
    username: string;
    email: string;
  }
  
  export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
  }