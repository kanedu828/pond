export interface UpdateUsernameRequest {
  newUsername: string;
}

export interface UpdateUsernameResponse {
  updated: boolean;
  error: string;
}
