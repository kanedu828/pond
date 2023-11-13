import { Request, Response } from 'express';
import { Profile } from 'passport-google-oauth20';
import FishDao from '../dao/fishDao';
import PondUserDao from '../dao/pondUserDao';
import PondUser from '../models/pondUserModel';
import PondUserService from '../service/pondUserService';
import { pondUserLogger } from '../util/logger';
import { UpdateUsernameRequest, UpdateUsernameResponse } from '../../../shared/types/UserTypes';

export default class PondUserController {
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
    } catch (err: any) {
      pondUserLogger.error(err.message);
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
    } catch (err: any) {
      pondUserLogger.error(err.message);
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
    } catch (err: any) {
      pondUserLogger.error(err.message);
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
      res.status(201).json(pondUser);
    } catch (err: any) {
      pondUserLogger.error(err.message);
      res.status(400).json(err);
    }
  }

  async updateUsername(req: Request, res: Response): Promise<void> {
    const user: PondUser = req.user as PondUser;
    const requestBody: UpdateUsernameRequest = req.body;
    const newUsername = requestBody.newUsername;
    if (newUsername.length < 3 || newUsername.length > 20) {
      const updateUsernameResponse: UpdateUsernameResponse = { updated: false, error: 'Username length must be between 3 and 20' };
      res.status(400).json(updateUsernameResponse);
      return;
    }
    if (newUsername.startsWith('guest-')) {
      const updateUsernameResponse: UpdateUsernameResponse = { updated: false, error: 'Username cannot begin with \"guest-\"' };
      res.status(400).json(updateUsernameResponse);
      return;
    }
    try {
      await this.pondUserService.updateUsername(user.id, requestBody.newUsername);
      const updateUsernameResponse: UpdateUsernameResponse = { updated: true, error: '' };
      res.status(201).json(updateUsernameResponse);
    } catch (err: any) {
      pondUserLogger.error(err.message);
      const updateUsernameResponse: UpdateUsernameResponse = { updated: false, error: 'This name already exists' };
      res.status(400).json(updateUsernameResponse);
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
      res.json(userFish);
    } catch (err: any) {
      pondUserLogger.error(err.message);
      res.status(400).json(err);
    }
  }

  async getTopHundredPondUsersByExp(req: Request, res: Response): Promise<void> {
    try {
      const pondUsers = await this.pondUserService.getTopPondUsers('exp', 'desc', 100);
      res.status(200).json(pondUsers);
    } catch (err: any) {
      pondUserLogger.error(err.message);
      res.status(400).json(err);
    }
  }
}
