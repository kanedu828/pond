import { PondUser } from "./types";

export interface StatusResponse {
  authenticated: boolean;
}

export interface RegisterRequest {
  username: string;
  password: string;
}

export interface RegisterResponse {
  success: boolean,
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