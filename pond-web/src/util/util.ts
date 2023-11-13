import { UserFish } from "../../../shared/types/types";

export const sortComparator = (a: UserFish, b: UserFish, sortBy: string) => {
    const rarityMapping = {
      'common': 3,
      'rare': 2,
      'epic': 1,
      'legendary': 0
    };
    if (sortBy === 'Rarity') {
        return rarityMapping[a.fish.rarity as keyof typeof rarityMapping] - rarityMapping[b.fish.rarity as keyof typeof rarityMapping];
    } else if (sortBy === 'Name') {
        return a.fish.name.localeCompare(b.fish.name);
    } else if (sortBy === 'Largest Caught') {
        return b.maxLength - a.maxLength;
    } else if (sortBy === 'Amount Caught') {
        return b.count - a.count;
    } else {
        return a.fish.id - b.fish.id;
    }
}

interface JsonObject {
    [key: string]: any;
}
  
export function paginateArray<T extends JsonObject>(array: T[], pageSize: number): T[][] {
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