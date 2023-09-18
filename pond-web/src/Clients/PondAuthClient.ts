import { LogoutResponse, StatusResponse } from '../../../shared/types/AuthTypes';

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
            method: 'get',
            credentials: 'include'
        })
            .then((res: Response) => res.json())
            .catch((_err: Error) => {
        });
        return response;
    }

    async logout(): Promise<LogoutResponse> {
        const response = await fetch(`${this.apiUrl}/auth/logout`, {
            method: 'get',
            credentials: 'include'
        })
            .then((res: Response) => res.json())
            .catch((_err: Error) => {
        });
        return response;
    }
}