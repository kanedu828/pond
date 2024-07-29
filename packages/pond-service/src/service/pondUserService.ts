import { randomBytes } from "crypto";
import FishDao from "../dao/fishDao";
import PondUserDao from "../dao/pondUserDao";
import PondUser from "../models/pondUserModel";
import fishJson from "../data/fish.json";
import { Fish, UserFish } from "../../../shared/types/types";
import { binarySearch } from "../util/util";
import bcrypt from "bcrypt";

class PondUserService {
  readonly pondUserDao: PondUserDao;

  readonly fishDao: FishDao;

  constructor(pondUserDao: PondUserDao, fishDao: FishDao) {
    this.pondUserDao = pondUserDao;
    this.fishDao = fishDao;
  }

  private transformToPondUser(result: any): PondUser {
    return {
      id: result.id,
      username: result.username,
      exp: result.exp,
      location: result.location,
      isAccount: result.is_account,
    };
  }

  private async createRandomUsername(): Promise<string> {
    let randomUsername: string;
    let userExists: PondUser;

    // Loop until a unique username is found
    do {
      randomUsername = `guest-${randomBytes(6).toString("hex")}`;
      userExists = await this.pondUserDao.getPondUser({
        username: randomUsername,
      });
    } while (userExists);

    return randomUsername;
  }

  /**
   * This takes in a googleId because this is for when a user first logs in with google oauth.
   * Cannot be queried by regular id as it does not exist yet.
   *
   * @param googleId
   * @param email
   * @returns A pond user
   */
  async getOrCreateGooglePondUser(
    googleId: string,
    email: string,
  ): Promise<Express.User> {
    let result = await this.pondUserDao.getPondUser({
      google_id: googleId,
    });
    if (!result) {
      const randomUsername = await this.createRandomUsername();
      result = await this.pondUserDao.insertPondUser({
        email,
        google_id: googleId,
        username: randomUsername,
        is_account: true,
      });
    }
    return this.transformToPondUser(result);
  }

  async getPondUserByUsername(username: string): Promise<Express.User | null> {
    const result = await this.pondUserDao.getPondUser({ username });
    return result ? this.transformToPondUser(result) : null;
  }

  async getAuthenticatedPondUser(
    username: string,
    password: string,
  ): Promise<Express.User | null> {
    const pondUserPasswordHash =
      await this.pondUserDao.getPondUserPasswordHash(username);
    const compareResult = await bcrypt.compare(password, pondUserPasswordHash);
    if (compareResult === true) {
      const result = await this.pondUserDao.getPondUser({ username });
      return this.transformToPondUser(result);
    } else {
      return null;
    }
  }

  async createPondUser(username: string, password: string): Promise<PondUser> {
    const passwordHash = await bcrypt.hash(password, 10);
    const result = await this.pondUserDao.insertPondUser({
      username,
      password_hash: passwordHash,
      is_account: true,
    });
    return this.transformToPondUser(result);
  }

  async bindGuestUser(
    id: number,
    username: string,
    password: string,
  ): Promise<PondUser> {
    const passwordHash = await bcrypt.hash(password, 10);
    const result = await this.pondUserDao.updatePondUser(
      { id },
      {
        username,
        password_hash: passwordHash,
        is_account: true,
        cookie: null,
      },
    );
    return this.transformToPondUser(result);
  }

  async getPondUserByCookie(cookie: string): Promise<Express.User | null> {
    const result = await this.pondUserDao.getPondUser({ cookie });
    return result ? this.transformToPondUser(result) : null;
  }

  async createCookiePondUser(cookie: string): Promise<Express.User> {
    const randomUsername = await this.createRandomUsername();
    const result = await this.pondUserDao.insertPondUser({
      cookie,
      username: randomUsername,
      is_account: false,
    });
    return this.transformToPondUser(result);
  }

  async getOrCreateCookiePondUser(cookie: string): Promise<Express.User> {
    let cookiePondUser = await this.getPondUserByCookie(cookie);
    if (!cookiePondUser) {
      cookiePondUser = await this.createCookiePondUser(cookie);
    }
    return this.transformToPondUser(cookiePondUser);
  }

  /**
   * Gets pond user by id.
   *
   * @param id
   * @returns A pond user
   */
  async getPondUser(id: number): Promise<Express.User> {
    const result = await this.pondUserDao.getPondUser({ id });
    return this.transformToPondUser(result);
  }

  /**
   * Gets all of a user's fish
   * @param id
   * @returns List of fish
   */
  async getUserFish(id: number): Promise<UserFish[]> {
    const result = await this.fishDao.getFish({ pond_user_id: id });
    const userFishArr = result.map((fishResult: any) => {
      const fishIndex = binarySearch<Fish>(
        fishJson,
        fishResult.fish_id,
        (fish: Fish) => fish.id,
      );
      const fishData: Fish = fishJson[fishIndex];
      const userFish: UserFish = {
        fish: fishData,
        maxLength: fishResult.max_length,
        count: fishResult.count,
        pondUserId: fishResult.pond_user_id,
      };
      return userFish;
    });
    return userFishArr;
  }

  /**
   * Updates the user's location
   * @param id user's id
   * @param pond pond location
   * @returns the updated user
   */
  async updateUserLocation(id: number, pond: string): Promise<PondUser> {
    const result = await this.pondUserDao.updatePondUser(
      { id },
      { location: pond },
    );
    return result;
  }

  /**
   * Updates the user username
   * @param id user's id
   * @param newUsername User's new username
   * @returns the updated user
   */
  async updateUsername(id: number, newUsername: string): Promise<PondUser> {
    const result = await this.pondUserDao.updatePondUser(
      { id },
      { username: newUsername },
    );
    return result;
  }

  /**
   * Returns the top users based on a column
   * @param column
   * @param order
   * @param limit
   * @returns list of pond users
   */
  async getTopPondUsers(
    column: string,
    order: "asc" | "desc",
    limit: number,
  ): Promise<PondUser[]> {
    const result = await this.pondUserDao.getTopPondUsers(column, order, limit);
    return result;
  }
}

export default PondUserService;
