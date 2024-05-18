import { UserFish } from '../../../shared/types/types';

export const sortComparator = (a: UserFish, b: UserFish, sortBy: string) => {
	const rarityMapping = {
		common: 3,
		rare: 2,
		epic: 1,
		legendary: 0,
	};
	if (sortBy === 'Rarity') {
		return (
			rarityMapping[a.fish.rarity as keyof typeof rarityMapping] -
      rarityMapping[b.fish.rarity as keyof typeof rarityMapping]
		);
	} else if (sortBy === 'Name') {
		return a.fish.name.localeCompare(b.fish.name);
	} else if (sortBy === 'Largest Caught') {
		return b.maxLength - a.maxLength;
	} else if (sortBy === 'Amount Caught') {
		return b.count - a.count;
	} else {
		return a.fish.id - b.fish.id;
	}
};

interface JsonObject {
  [key: string]: any;
}

export function paginateArray<T extends JsonObject>(
	array: T[],
	pageSize: number,
): T[][] {
	const paginatedArray: T[][] = [];

	for (let i = 0; i < array.length; i += pageSize) {
		const page = array.slice(i, i + pageSize);
		while (page.length < pageSize) {
			const emptyObject: T = {} as T;
			page.push(emptyObject);
		}
		paginatedArray.push(page);
	}

	return paginatedArray;
}

export const getFishImagePath = (fishName: string, fishId: number): string => {
	fishName = fishName.toLowerCase();
	const fish_file_id = `/fishImages/${fishName.replace(
		/ /g,
		'_',
	)}_${fishId}.png`;
	return fish_file_id;
};

export const getFishImageUnknownPath = () => {
	return '/fishImages/unknown.png';
};

/**
 * Function to get a cookie by name
 * @param name - The name of the cookie
 * @returns The cookie value if it exists, otherwise null
 */
export const getCookie = (name: string): string | null => {
	const value = `; ${document.cookie}`;
	const parts = value.split(`; ${name}=`);
	if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
	return null;
};
  
/**
   * Function to set a cookie
   * @param name - The name of the cookie
   * @param value - The value of the cookie
   */
 export const setCookie = (name: string, value: string, days: number = 30): void => {
	const date = new Date();
	date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
	const expires = `expires=${date.toUTCString()}`;
	const secure = import.meta.env.PROD ? 'Secure' : '';
	document.cookie = `${name}=${value}; ${expires}; path=/; ${secure}`;
  };
  
/**
   * Function to ensure the pondAuthToken cookie exists, if it doesn't, create one
   */
export const ensurePondAuthToken = (): void => {
	const cookieName = 'pondAuthToken';
	if (!getCookie(cookieName)) {
		const authToken = generateRandomToken();
		setCookie(cookieName, authToken);
	}
};
  
/**
   * Function to generate a random token
   * @returns A random token string
   */
export const generateRandomToken = (): string => {
	const array = new Uint8Array(48);
	window.crypto.getRandomValues(array);
	return Array.from(array, byte => ('0' + byte.toString(16)).slice(-2)).join('');
};
  