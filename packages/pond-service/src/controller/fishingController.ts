import FishingService from "../service/fishingService";
import { fishingLogger } from "../util/logger";
import { sleep } from "../util/util";

class FishingController {
  fishingService: FishingService;

  constructor(fishingService: FishingService) {
    this.fishingService = fishingService;
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
      const LOW_BOUND = 600;
      const HIGH_BOUND = 3600;
      const currentFish = await this.fishingService.pollFish(
        userId,
        LOW_BOUND,
        HIGH_BOUND,
      );
      if (currentFish) {
        socket.emit("new-fish", currentFish);
      }
    } catch (err: any) {
      fishingLogger.error(err.message);
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
      socket.emit("caught-fish", collectedFish);
    } catch (err: any) {
      fishingLogger.error(err.message);
    }
  }

  getCurrentFish(socket: any) {
    try {
      const userId = socket.request.user.id;
      const currentFish = this.fishingService.getCurrentFish(userId);
      if (currentFish) {
        socket.emit("new-fish", currentFish);
      }
    } catch (err: any) {
      fishingLogger.error(err.message);
    }
  }

  updateConnectedSocketId(socket: any) {
    try {
      const userId = socket.request.user.id;
      const socketId = socket.id;
      return this.fishingService.updateConnectedSocketId(userId, socketId);
    } catch (err: any) {
      fishingLogger.error(err.message);
    }
    return null;
  }

  getConnectedSocketId(socket: any) {
    try {
      const userId = socket.request.user.id;
      return this.fishingService.getConnectSocketId(userId);
    } catch (err: any) {
      fishingLogger.error(err.message);
    }
    return null;
  }
}

export default FishingController;
