import { Fish } from '../data/fishTypes';
import {
  binarySearch,
  getRandomArrayElement,
  getRandomInt,
  getRandomRarity,
  randomNormal,
  sleep
} from '../util/util';
import fishJson from '../data/fish.json';
import pondJson from '../data/ponds.json';
import PondUserDao from '../dao/pondUserDao';
import FishDao from '../dao/fishDao';

interface FishInstance {
  id: number;
  name: string;
  description: string;
  lengthRangeInCm: number[];
  expRewarded: number;
  rarity: string;
  secondsFishable: number;
  length: number;
  expirationDate: number;
}

export default class FishingService {
  readonly userCurrentFish = new Map<number, FishInstance>();

  readonly connectedUsers = new Map<number, number>();

  readonly nextFishDue = new Map<number, number>();

  readonly pondUserDao: PondUserDao;

  readonly fishDao: FishDao;

  constructor(pondUserDao: PondUserDao, fishDao: FishDao) {
    this.pondUserDao = pondUserDao;
    this.fishDao = fishDao;
  }

  /**
   * Generates a fish of random rarity and type from the specified pond location
   * @param location The pond to generate the fish from
   * @returns FishInstance
   */
  static generateFish(location: string): FishInstance {
    const rarity = getRandomRarity();
    const pond = pondJson.find((element) => element.name === location);
    if (!pond) {
      throw new Error(`Pond ${location} does not exist.`);
    }
    const availableFish = pond.availableFish.map((fishId) => {
      const fishIndex = binarySearch(fishJson, fishId, (element: Fish) => element.id);
      return fishJson[fishIndex];
    });
    const fishOfRarity = availableFish.filter(
      (element) => element && element.rarity === rarity && element.active
    );
    const fish: Fish = getRandomArrayElement(fishOfRarity || []);

    const length = Math.floor(randomNormal(fish.lengthRangeInCm[0], fish.lengthRangeInCm[1]));

    const expirationDate = Date.now() + fish.secondsFishable * 1000;
    const fishInstance: FishInstance = {
      ...fish,
      length,
      expirationDate
    };
    return fishInstance;
  }

  /**
   * This function is deprecated.
   * @param userId The user id to poll a fish for
   * @param low The lower bound for possible due date for a fish in seconds
   * @param high The higher bound for possible due date for a fish in seconds
   * @returns null or fish instance
   */
  async getFish(
    userId: number,
    socketId: number,
    low: number,
    high: number
  ): Promise<FishInstance | null> {
    const secondsUntilNextFish = getRandomInt(low, high);
    await sleep(secondsUntilNextFish * 1000);
    const currentFish = this.getCurrentFish(userId);
    if (!currentFish) {
      const user = await this.pondUserDao.getPondUser({
        id: userId
      });
      let { location } = user;

      if (!(location in fishJson)) {
        // If user does not have a valid location, reset to the deafult location
        this.pondUserDao.updatePondUser({ id: userId }, { location: 'Pond' });
        location = 'Pond';
      }
      const fishInstance = FishingService.generateFish(location);
      // This is needed because extra sessions are still active even after logging out/disconnecting
      // This causes client to recieve fish earlier by refreshing page.
      if (socketId === this.getConnectSocketId(userId)) {
        this.userCurrentFish.set(userId, fishInstance);
      }
      return fishInstance;
    }
    return currentFish;
  }

  /**
   * This function polls for a fish. If the user does not currently have a
   * non-expired fish, this function decides the next date that the user is
   * due for a fish or randomly chooses a fish to return.
   * @param userId The user id to poll a fish for
   * @param low The lower bound for possible due date for a fish in seconds
   * @param high The higher bound for possible due date for a fish in seconds
   * @returns null or fish instance
   */
  async pollFish(userId: number, low: number, high: number): Promise<FishInstance | null> {
    if (!this.getCurrentFish(userId)) {
      const fishDue = this.nextFishDue.get(userId);

      // If a fish is too far past its due date, the user should
      // not be able to retrieve a fish. We set an aribrary buffer
      // (eg. 2 minutes) where if a fish is too far past the due date,
      // then we set a new due date rather than generate a fish.
      const fishDueBuffer = 60 * 2 * 1000;

      if (!fishDue || Date.now() > fishDue + fishDueBuffer) {
        const secondsUntilNextFish = getRandomInt(low, high);
        this.nextFishDue.set(userId, Date.now() + secondsUntilNextFish * 1000);
      } else if (Date.now() > fishDue) {
        const user = await this.pondUserDao.getPondUser({
          id: userId
        });
        let { location } = user;
        if (!(location in fishJson)) {
          // If user does not have a valid location, reset to the deafult location
          this.pondUserDao.updatePondUser({ id: userId }, { location: 'Pond' });
          location = 'Pond';
        }
        const fishInstance = FishingService.generateFish(location);
        this.userCurrentFish.set(userId, fishInstance);
        this.nextFishDue.delete(userId);
      }
    }
    return this.getCurrentFish(userId);
  }

  /**
   * Collects the user's current fish and puts it in their collection.
   * If there is no fish to collect, return null
   * @param userId
   * @returns FishInstance or null
   */
  async collectFish(userId: number): Promise<FishInstance | null> {
    const collectedFish: FishInstance | null = this.getCurrentFish(userId);
    if (collectedFish) {
      const fishQuery = await this.fishDao.getFish({
        fish_id: collectedFish.id,
        pond_user_id: userId
      });
      if (fishQuery.length > 0) {
        const sameFish = fishQuery[0];
        await this.fishDao.updateFish(
          {
            fish_id: collectedFish.id,
            pond_user_id: userId
          },
          {
            count: sameFish.count + 1,
            max_length: Math.max(collectedFish.length, sameFish.max_length)
          }
        );
      } else {
        await this.fishDao.insertFish({
          fish_id: collectedFish.id,
          pond_user_id: userId,
          max_length: collectedFish.length,
          count: 1
        });
      }
      await this.pondUserDao.incrementPondUserExp(userId, collectedFish.expRewarded);

      this.userCurrentFish.delete(userId);
      return collectedFish;
    }
    return null;
  }

  /**
   * Gets the current fish that is being sent to the user
   * @param userId The user Id
   * @returns Fish Instance or null
   */
  getCurrentFish(userId: number): FishInstance | null {
    const currentFishInstance = this.userCurrentFish.get(userId) || null;
    if (currentFishInstance && currentFishInstance.expirationDate < Date.now()) {
      this.userCurrentFish.delete(userId);
      return null;
    }
    return currentFishInstance;
  }

  /**
   * Sets the current socket id associated with the user
   * @param userId The user ID
   * @param socketId The socket ID
   * @returns number or null
   */
  updateConnectedSocketId(userId: number, socketId: number): number | null {
    const lastSocketId = this.connectedUsers.get(userId) || null;
    this.connectedUsers.set(userId, socketId);
    return lastSocketId;
  }

  /**
   * Gets the current socket associated to the user
   * @param userId The user ID
   * @returns number or null
   */
  getConnectSocketId(userId: number): number | null {
    return this.connectedUsers.get(userId) || null;
  }
}
