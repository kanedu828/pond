export interface PondUser {
    id: number;
    username: string;
    location: string;
    exp: number;
}

export interface UserFish {
    fish: Fish;
    pondUserId: number;
    count: number;
    maxLength: number;
}

export interface Fish {
    id: number;
    name: string;
    description: string;
    lengthRangeInCm: number[];
    expRewarded: number;
    rarity: string;
    secondsFishable: number;
    active: boolean;
}

export interface FishInstance {
    fish: Fish;
    length: number;
    expirationDate: number;
}

export interface Pond {
    name: string;
    requiredLevel: number;
}
  