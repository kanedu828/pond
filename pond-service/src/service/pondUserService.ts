import { randomBytes } from 'crypto';
import FishDao from '../dao/fishDao';
import PondUserDao from '../dao/pondUserDao';
import PondUser from '../models/pondUserModel';
import UserFish from '../models/userFishModel';

class PondUserService {
  readonly pondUserDao: PondUserDao;

  readonly fishDao: FishDao;

  constructor(pondUserDao: PondUserDao, fishDao: FishDao) {
    this.pondUserDao = pondUserDao;
    this.fishDao = fishDao;
  }

  /**
   * This takes in a googleId because this is for when a user first logs in with google oauth.
   * Cannot be queried by regular id as it does not exist yet.
   *
   * @param googleId
   * @param email
   * @returns A pond user
   */
  async getOrCreatePondUser(googleId: string, email: string): Promise<Express.User> {
    let result = await this.pondUserDao.getPondUser({
      google_id: googleId
    });
    if (!result) {
      const randomUsername = `guest-${randomBytes(48).toString('hex')}`;
      result = await this.pondUserDao.insertPondUser({
        email,
        google_id: googleId,
        username: randomUsername
      });
    }
    const pondUser: PondUser = {
      id: result.id,
      username: result.username,
      exp: result.exp,
      location: result.location
    };
    return pondUser;
  }

  /**
   * Gets pond user by id.
   *
   * @param id
   * @returns A pond user
   */
  async getPondUser(id: number): Promise<Express.User> {
    const result = await this.pondUserDao.getPondUser({ id });
    return result;
  }

  /**
   * Gets all of a user's fish
   * @param id
   * @returns List of fish
   */
  async getUserFish(id: number): Promise<UserFish[]> {
    const result = await this.fishDao.getFish({ pond_user_id: id });
    const userFishArr = result.map((element: any) => {
      const userFish: UserFish = {
        fishId: element.fish_id,
        maxLength: element.max_length,
        count: element.count,
        pondUserId: element.pond_user_id
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
    const result = await this.pondUserDao.updatePondUser({ id }, { location: pond });
    return result;
  }

  /**
   * Returns the top users based on a column
   * @param column
   * @param order
   * @param limit
   * @returns list of pond users
   */
  async getTopPondUsers(column: string, order: 'asc' | 'desc', limit: number): Promise<PondUser[]> {
    const result = await this.pondUserDao.getTopPondUsers(column, order, limit);
    return result;
  }
}

export default PondUserService;
