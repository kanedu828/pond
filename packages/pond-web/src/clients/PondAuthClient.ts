import {
  LogoutResponse,
  StatusResponse,
} from "../../../shared/types/AuthTypes";

export class PondAuthClient {
  private apiUrl: string;

  constructor() {
    this.apiUrl = import.meta.env.VITE_POND_API_URL;
    if (!this.apiUrl) {
      throw new Error(`Api URL: ${this.apiUrl} could not be found.`);
    }
  }

  async status(): Promise<StatusResponse> {
    const response = await fetch(`${this.apiUrl}/auth/status`, {
      method: "get",
      credentials: "include",
    });
    return await response.json();
  }

  async logout(): Promise<LogoutResponse> {
    const response = await fetch(`${this.apiUrl}/auth/logout`, {
      method: "post",
      credentials: "include",
    });
    return response.json();
  }
}
