import { Request, Response } from 'express';
import { Profile } from 'passport-google-oauth20';
import FishDao from '../dao/fishDao';
import PondUserDao from '../dao/pondUserDao';
import { Fish } from '../data/fishTypes';
import PondUser from '../models/pondUserModel';
import PondUserService from '../service/pondUserService';
import fishJson from '../data/fish.json';
import { binarySearch } from '../util/util';
import { pondUserLogger } from '../util/logger';

class PondUserController {
  pondUserService: PondUserService;

  constructor(pondUserDao: PondUserDao, fishDao: FishDao) {
    this.pondUserService = new PondUserService(pondUserDao, fishDao);
  }

  /**
   *
   * @param req
   * @param profile
   * @returns pondUser
   */
  async getOrCreatePondUser(profile: Profile): Promise<Express.User | null> {
    try {
      const email = profile.emails?.[0].value ?? null;
      if (!email) {
        throw new Error('Google Id does not have an associated email');
      } else {
        const pondUser = await this.pondUserService.getOrCreatePondUser(profile.id, email);
        return pondUser;
      }
    } catch (err) {
      pondUserLogger.error(err);
    }
    return null;
  }

  /**
   *
   * @param req
   * @param res
   */
  async getPondUser(req: Request, res: Response): Promise<void> {
    try {
      const pondUser = await this.pondUserService.getPondUser(req.body.id);
      res.status(200).json(pondUser);
    } catch (err) {
      pondUserLogger.error(err);
      res.status(400).json(err);
    }
  }

  /**
   *
   * @param id
   * @returns
   */
  async getPondUserById(id: number): Promise<Express.User | null> {
    try {
      const pondUser = await this.pondUserService.getPondUser(id);
      return pondUser;
    } catch (err) {
      pondUserLogger.error(err);
    }
    return null;
  }

  async updateUserLocation(req: Request, res: Response): Promise<void> {
    const user: PondUser = req.user as PondUser;
    try {
      if (!req.params.location) {
        throw new Error('No location paramter in request');
      }
      const pondUser = await this.pondUserService.updateUserLocation(user.id, req.params.location);
      res.status(200).json(pondUser);
    } catch (err) {
      pondUserLogger.error(err);
      res.status(400).json(err);
    }
  }

  async getUserFish(req: Request, res: Response): Promise<void> {
    const user: PondUser = req.user as PondUser;
    if (!user) {
      pondUserLogger.error('User is not authenticated');
      res.status(401);
    }
    try {
      const userFish = await this.pondUserService.getUserFish(user.id);
      const userFishRes = userFish.map((fish) => {
        const fishIndex = binarySearch<Fish>(fishJson, fish.fishId, (element: Fish) => element.id);
        const fishData: Fish = fishJson[fishIndex];
        return {
          ...fish,
          ...fishData
        };
      });
      res.json(userFishRes);
    } catch (err) {
      pondUserLogger.error(err);
      res.status(400).json(err);
    }
  }

  async getTopHundredPondUsersByExp(req: Request, res: Response): Promise<void> {
    try {
      const pondUsers = await this.pondUserService.getTopPondUsers('exp', 'desc', 100);
      res.status(200).json(pondUsers);
    } catch (err) {
      pondUserLogger.error(err);
      res.status(400).json(err);
    }
  }
}

export default PondUserController;
