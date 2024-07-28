export interface StatusResponse {
  authenticated: boolean;
}

export interface RegisterRequest {
  username: string;
  password: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
}

export interface BindGuestRequest {
  id: number;
  username: string;
  password: string;
}

export interface BindGuestResponse {
  success: boolean;
  message: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LogoutResponse {}

export interface LoginResponse {
  message: string;
  incorrectCredentials: boolean;
}

export interface GuestLoginResponse {}
