import { VerifyAuthResponse } from '../../../shared/types/AuthTypes'

export class PondAuthClient {
    
    private apiUrl: string;

    constructor() {
        this.apiUrl = import.meta.env.VITE_POND_API_URL;
        if (!this.apiUrl) {
            throw new Error(`Api URL: ${this.apiUrl} could not be found.`);
        }
    }

    async verifyAuth(): Promise<VerifyAuthResponse> {
        const response = await fetch(`${this.apiUrl}/auth/verifyAuth`, {
            method: 'get',
            credentials: 'include'
        })
            .then((res: Response) => res.json())
            .catch((_err: Error) => {
        });

        return response;
    }
}