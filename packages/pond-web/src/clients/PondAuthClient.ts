import {
	BindGuestRequest,
	BindGuestResponse,
	GuestLoginResponse,
	LoginRequest,
	LoginResponse,
	LogoutResponse,
	RegisterRequest,
	RegisterResponse,
	StatusResponse,
} from '../../../shared/types/AuthTypes';

const API_PATH = 'auth';

export class PondAuthClient {
	private apiUrl: string;

	constructor() {
		this.apiUrl = import.meta.env.VITE_POND_API_URL;
		if (!this.apiUrl) {
			throw new Error(`Api URL: ${this.apiUrl} could not be found.`);
		}
	}

	async status(): Promise<StatusResponse> {
		const response = await fetch(`${this.apiUrl}/${API_PATH}/status`, {
			method: 'get',
			credentials: 'include',
		});
		return await response.json();
	}

	async logout(): Promise<LogoutResponse> {
		const response = await fetch(`${this.apiUrl}/${API_PATH}/logout`, {
			method: 'post',
			credentials: 'include',
		});
		return response.json();
	}

	async guestLogin(): Promise<GuestLoginResponse> {
		const response = await fetch(`${this.apiUrl}/${API_PATH}/guest-login`, {
			method: 'post',
			credentials: 'include',
		});
		return response.json();
	}

	async login(req: LoginRequest): Promise<LoginResponse> {
		const response = await fetch(`${this.apiUrl}/${API_PATH}/login`, {
			method: 'post',
			headers: {
				'Content-Type': 'application/json', // Indicates the content
			},
			credentials: 'include',
			body: JSON.stringify(req),
		});
		return response.json();
	}

	async register(req: RegisterRequest): Promise<RegisterResponse> {
		const response = await fetch(`${this.apiUrl}/${API_PATH}/register`, {
			method: 'post',
			headers: {
				'Content-Type': 'application/json', // Indicates the content
			},
			credentials: 'include',
			body: JSON.stringify(req),
		});
		return response.json();
	}

	async bindGuest(req: BindGuestRequest): Promise<BindGuestResponse> {
		const response = await fetch(`${this.apiUrl}/${API_PATH}/bind-guest`, {
			method: 'post',
			headers: {
				'Content-Type': 'application/json', // Indicates the content
			},
			credentials: 'include',
			body: JSON.stringify(req),
		});
		return response.json();
	}

	async setAuthCookie(): Promise<Record<string, never>> {
		const response = await fetch(`${this.apiUrl}/${API_PATH}/set-cookie`, {
			method: 'get',
			credentials: 'include',
		});
		return await response.json();
	}
}
