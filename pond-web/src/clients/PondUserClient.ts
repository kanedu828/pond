import { PondUser, UserFish } from '../../../shared/types/types';

export class PondUserClient {
    
    private apiUrl: string;

    constructor() {
        this.apiUrl = import.meta.env.VITE_POND_API_URL;
        if (!this.apiUrl) {
            throw new Error(`Api URL: ${this.apiUrl} could not be found.`);
        }
    }

    async getUser(): Promise<PondUser> {
        const user = await fetch(`${this.apiUrl}/user`, {
            method: 'get',
            credentials: 'include'
        });

        return await user.json();
    }

    async getUserFish(): Promise<[UserFish]> {
        const fish = await fetch(`${this.apiUrl}/user/fish`, {
            method: 'get',
            credentials: 'include'
        });

        return await fish.json();
    }
}