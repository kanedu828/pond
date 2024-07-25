import { PondUser, UserFish } from '../../../shared/types/types';
import {
	UpdateUsernameRequest,
	UpdateUsernameResponse,
} from '../../../shared/types/UserTypes';

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
			credentials: 'include',
		});

		return await user.json();
	}

	async getUserFish(): Promise<UserFish[]> {
		const fish = await fetch(`${this.apiUrl}/user/fish`, {
			method: 'get',
			credentials: 'include',
		});

		return await fish.json();
	}

	async getTopHundredUsersByExp(): Promise<PondUser[]> {
		const users = await fetch(`${this.apiUrl}/user/leaderboard`, {
			method: 'get',
			credentials: 'include',
		});

		return await users.json();
	}

	// TODO: REFACTOR PARAMS INTO REQ OBJ
	async updateUsername(newUsername: string): Promise<UpdateUsernameResponse> {
		const updateUsernameRequest: UpdateUsernameRequest = { newUsername };

		const response = await fetch(`${this.apiUrl}/user/update-username`, {
			method: 'post',
			headers: {
				'Content-Type': 'application/json', // Indicates the content
			},
			credentials: 'include',
			body: JSON.stringify(updateUsernameRequest),
		});

		return await response.json();
	}
}
