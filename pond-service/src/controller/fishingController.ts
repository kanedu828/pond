import FishDao from '../dao/fishDao';
import PondUserDao from '../dao/pondUserDao';
import FishingService from '../service/fishingService';
import { fishingLogger } from '../util/logger';
import { sleep } from '../util/util';

class FishingController {
  fishingService: FishingService;

  constructor(pondUserDao: PondUserDao, fishDao: FishDao) {
    this.fishingService = new FishingService(pondUserDao, fishDao);
  }

  /**
   * This method is no longer used becasue of unreliablity with
   * retrieving fish.
   * @param userId
   * @param low
   * @param high
   * @returns
   */
  async getFish(userId: number, socketId: number) {
    try {
      return await this.fishingService.getFish(userId, socketId, 10, 30);
    } catch (err) {
      fishingLogger.error(err);
    }
    return null;
  }

  /**
   *
   * @param socket
   */
  async pollFish(socket: any) {
    try {
      // How often to poll for fish
      await sleep(10000);
      const userId = socket.request.user.id;
      const currentFish = await this.fishingService.pollFish(userId, 10 * 60, 60 * 60);
      if (currentFish) {
        socket.emit('new-fish', currentFish);
      }
    } catch (err) {
      fishingLogger.error(err);
    }
  }

  /**
   *
   * @param userId
   * @returns
   */
  async collectFish(socket: any) {
    try {
      const userId = socket.request.user.id;
      const collectedFish = await this.fishingService.collectFish(userId);
      socket.emit('caught-fish', collectedFish);
    } catch (err) {
      fishingLogger.error(err);
    }
  }

  getCurrentFish(socket: any) {
    try {
      const userId = socket.request.user.id;
      const currentFish = this.fishingService.getCurrentFish(userId);
      if (currentFish) {
        socket.emit('new-fish', currentFish);
      }
    } catch (err) {
      fishingLogger.error(err);
    }
  }

  updateConnectedSocketId(socket: any) {
    try {
      const userId = socket.request.user.id;
      const socketId = socket.id;
      return this.fishingService.updateConnectedSocketId(userId, socketId);
    } catch (err) {
      fishingLogger.error(err);
    }
    return null;
  }

  getConnectedSocketId(socket: any) {
    try {
      const userId = socket.request.user.id;
      return this.fishingService.getConnectSocketId(userId);
    } catch (err) {
      fishingLogger.error(err);
    }
    return null;
  }
}

export default FishingController;
