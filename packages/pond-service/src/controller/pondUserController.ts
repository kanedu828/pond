import { Request, Response } from "express";
import { Profile } from "passport-google-oauth20";
import PondUserService from "../service/pondUserService";
import { pondUserLogger } from "../util/logger";
import {
  UpdateUsernameRequest,
  UpdateUsernameResponse,
} from "../../../shared/types/UserTypes";
import {
  BindGuestRequest,
  BindGuestResponse,
  RegisterRequest,
  RegisterResponse,
} from "../../../shared/types/AuthTypes";
import { PondUser } from "../../../shared/types/types";

export default class PondUserController {
  pondUserService: PondUserService;

  constructor(pondUserService: PondUserService) {
    this.pondUserService = pondUserService;
  }

  /**
   *
   * @param req
   * @param profile
   * @returns pondUser
   */
  async getOrCreateGooglePondUser(
    profile: Profile,
  ): Promise<Express.User | null> {
    try {
      const email = profile.emails?.[0].value ?? null;
      if (!email) {
        throw new Error("Google Id does not have an associated email");
      } else {
        const pondUser = await this.pondUserService.getOrCreateGooglePondUser(
          profile.id,
          email,
        );
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
   * @param profile
   * @returns pondUser
   */
  async getAuthenticatedPondUser(
    username: string,
    password: string,
  ): Promise<Express.User | null> {
    try {
      const pondUser = await this.pondUserService.getAuthenticatedPondUser(
        username,
        password,
      );
      return pondUser;
    } catch (err: any) {
      pondUserLogger.error(err.message);
    }
    return null;
  }

  async bindGuestUser(req: Request, res: Response): Promise<void> {
    const requestBody: BindGuestRequest = req.body;
    if (requestBody.username.length < 3) {
      const response: BindGuestResponse = {
        success: false,
        message: "Your username must be atleast 3 characters long.",
      };
      res.status(400).json(response);
      return;
    }

    if (requestBody.username.length > 24) {
      const response: RegisterResponse = {
        success: false,
        message: "Your username must be less than 25 characters long.",
      };
      res.status(400).json(response);
      return;
    }

    if (requestBody.password.length < 8) {
      const response: BindGuestResponse = {
        success: false,
        message: "Your password must be atleast 8 characters long.",
      };
      res.status(400).json(response);
      return;
    }

    try {
      await this.pondUserService.bindGuestUser(
        requestBody.id,
        requestBody.username,
        requestBody.password,
      );
      const response: BindGuestResponse = {
        success: true,
        message: "",
      };
      res.status(200).json(response);
    } catch (err: any) {
      pondUserLogger.error(err.message);
      const response: BindGuestResponse = {
        success: false,
        message: "This username is taken!",
      };
      res.status(400).json(response);
    }
  }

  /**
   * @param req
   * @param res
   */
  async registerUserLocal(req: Request, res: Response): Promise<void> {
    const requestBody: RegisterRequest = req.body;
    if (requestBody.username.length < 3) {
      const response: RegisterResponse = {
        success: false,
        message: "Your username must be atleast 3 characters long.",
      };
      res.status(400).json(response);
      return;
    }

    if (requestBody.username.length > 24) {
      const response: RegisterResponse = {
        success: false,
        message: "Your username must be less than 25 characters long.",
      };
      res.status(400).json(response);
      return;
    }

    if (requestBody.password.length < 8) {
      const response: RegisterResponse = {
        success: false,
        message: "Your password must be atleast 8 characters long.",
      };
      res.status(400).json(response);
      return;
    }

    try {
      await this.pondUserService.createPondUser(
        requestBody.username,
        requestBody.password,
      );
      const response: RegisterResponse = {
        success: true,
        message: "",
      };
      res.status(200).json(response);
    } catch (err: any) {
      pondUserLogger.error(err.message);
      const response: RegisterResponse = {
        success: false,
        message: "This username is taken!",
      };
      res.status(400).json(response);
    }
  }

  async getOrCreateCookiePondUser(
    cookie: string,
  ): Promise<Express.User | null> {
    try {
      const pondUser =
        await this.pondUserService.getOrCreateCookiePondUser(cookie);
      return pondUser;
    } catch (err: any) {
      pondUserLogger.error(err.message);
    }
    return null;
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
        throw new Error("No location paramter in request");
      }
      const pondUser = await this.pondUserService.updateUserLocation(
        user.id,
        req.params.location,
      );
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
      const updateUsernameResponse: UpdateUsernameResponse = {
        updated: false,
        error: "Username length must be between 3 and 20",
      };
      res.status(400).json(updateUsernameResponse);
      return;
    }
    if (newUsername.startsWith("guest-")) {
      const updateUsernameResponse: UpdateUsernameResponse = {
        updated: false,
        error: 'Username cannot begin with "guest-"',
      };
      res.status(400).json(updateUsernameResponse);
      return;
    }
    try {
      await this.pondUserService.updateUsername(
        user.id,
        requestBody.newUsername,
      );
      const updateUsernameResponse: UpdateUsernameResponse = {
        updated: true,
        error: "",
      };
      res.status(201).json(updateUsernameResponse);
    } catch (err: any) {
      pondUserLogger.error(err.message);
      const updateUsernameResponse: UpdateUsernameResponse = {
        updated: false,
        error: "This name already exists",
      };
      res.status(400).json(updateUsernameResponse);
    }
  }

  async getUserFish(req: Request, res: Response): Promise<void> {
    const user: PondUser = req.user as PondUser;
    if (!user) {
      pondUserLogger.error("User is not authenticated");
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

  async getTopHundredPondUsersByExp(
    req: Request,
    res: Response,
  ): Promise<void> {
    try {
      const pondUsers = await this.pondUserService.getTopPondUsers(
        "exp",
        "desc",
        100,
      );
      res.status(200).json(pondUsers);
    } catch (err: any) {
      pondUserLogger.error(err.message);
      res.status(400).json(err);
    }
  }
}
