import { Request, Response } from "express";
import { Profile } from "passport-google-oauth20";
import PondUserController from "./pondUserController";
import PondUserService from "../service/pondUserService";
import { PondUser, UserFish } from "../../../shared/types/types";
import PondUserDao from "../dao/pondUserDao";
import FishDao from "../dao/fishDao";

// Mock PondUserService
jest.mock("../service/pondUserService");

describe("PondUserController", () => {
  let pondUserController: PondUserController;
  let mockPondUserService: jest.Mocked<PondUserService>;
  let mockPondUserDao: jest.Mocked<PondUserDao>;
  let mockFishDao: jest.Mocked<FishDao>;

  beforeEach(() => {
    mockPondUserService = new PondUserService(
      mockPondUserDao,
      mockFishDao,
    ) as jest.Mocked<PondUserService>;
    pondUserController = new PondUserController(mockPondUserService);
  });

  describe("getOrCreateGooglePondUser", () => {
    it("should return a pond user when given a valid Google profile", async () => {
      const mockProfile: Profile = {
        id: "123",
        emails: [{ value: "test@example.com" }],
      } as Profile;

      const mockPondUser: Express.User = {
        id: 1,
        username: "testuser",
      } as Express.User;
      mockPondUserService.getOrCreateGooglePondUser.mockResolvedValue(
        mockPondUser,
      );

      const result =
        await pondUserController.getOrCreateGooglePondUser(mockProfile);
      expect(result).toEqual(mockPondUser);
      expect(
        mockPondUserService.getOrCreateGooglePondUser,
      ).toHaveBeenCalledWith("123", "test@example.com");
    });

    it("should return null when the Google profile has no email", async () => {
      const mockProfile: Profile = {
        id: "123",
        emails: [],
      } as unknown as Profile;

      const result =
        await pondUserController.getOrCreateGooglePondUser(mockProfile);
      expect(result).toBeNull();
    });
  });

  describe("getAuthenticatedPondUser", () => {
    it("should return a pond user when given valid credentials", async () => {
      const mockPondUser: Express.User = {
        id: 1,
        username: "testuser",
      } as Express.User;
      mockPondUserService.getAuthenticatedPondUser.mockResolvedValue(
        mockPondUser,
      );

      const result = await pondUserController.getAuthenticatedPondUser(
        "testuser",
        "password",
      );
      expect(result).toEqual(mockPondUser);
      expect(mockPondUserService.getAuthenticatedPondUser).toHaveBeenCalledWith(
        "testuser",
        "password",
      );
    });

    it("should return null when authentication fails", async () => {
      mockPondUserService.getAuthenticatedPondUser.mockRejectedValue(
        new Error("Authentication failed"),
      );

      const result = await pondUserController.getAuthenticatedPondUser(
        "testuser",
        "wrongpassword",
      );
      expect(result).toBeNull();
    });
  });

  describe("bindGuestUser", () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;

    beforeEach(() => {
      mockRequest = {
        body: {
          id: 1,
          username: "testuser",
          password: "password123",
        },
      };
      mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
    });

    it("should bind a guest user successfully", async () => {
      mockPondUserService.bindGuestUser.mockResolvedValue(
        undefined as unknown as PondUser,
      );

      await pondUserController.bindGuestUser(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: "",
      });
    });

    it("should return an error if username is too short", async () => {
      mockRequest.body.username = "ab";

      await pondUserController.bindGuestUser(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: "Your username must be atleast 3 characters long.",
      });
    });
  });

  describe("registerUserLocal", () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;

    beforeEach(() => {
      mockRequest = {
        body: {
          username: "newuser",
          password: "password123",
        },
      };
      mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
    });

    it("should register a new user successfully", async () => {
      mockPondUserService.createPondUser.mockResolvedValue(
        undefined as unknown as PondUser,
      );

      await pondUserController.registerUserLocal(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: "",
      });
    });

    it("should return an error if username is too short", async () => {
      mockRequest.body.username = "ab";

      await pondUserController.registerUserLocal(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: "Your username must be atleast 3 characters long.",
      });
    });

    it("should return an error if password is too short", async () => {
      mockRequest.body.password = "short";

      await pondUserController.registerUserLocal(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: "Your password must be atleast 8 characters long.",
      });
    });
  });

  describe("getOrCreateCookiePondUser", () => {
    it("should return a pond user when given a valid cookie", async () => {
      const mockPondUser: Express.User = {
        id: 1,
        username: "testuser",
      } as Express.User;
      mockPondUserService.getOrCreateCookiePondUser.mockResolvedValue(
        mockPondUser,
      );

      const result =
        await pondUserController.getOrCreateCookiePondUser("valid-cookie");
      expect(result).toEqual(mockPondUser);
      expect(
        mockPondUserService.getOrCreateCookiePondUser,
      ).toHaveBeenCalledWith("valid-cookie");
    });

    it("should return null when an error occurs", async () => {
      mockPondUserService.getOrCreateCookiePondUser.mockRejectedValue(
        new Error("Cookie error"),
      );

      const result =
        await pondUserController.getOrCreateCookiePondUser("invalid-cookie");
      expect(result).toBeNull();
    });
  });

  describe("getPondUserById", () => {
    it("should return a pond user when given a valid id", async () => {
      const mockPondUser: Express.User = {
        id: 1,
        username: "testuser",
      } as Express.User;
      mockPondUserService.getPondUser.mockResolvedValue(mockPondUser);

      const result = await pondUserController.getPondUserById(1);
      expect(result).toEqual(mockPondUser);
      expect(mockPondUserService.getPondUser).toHaveBeenCalledWith(1);
    });

    it("should return null when an error occurs", async () => {
      mockPondUserService.getPondUser.mockRejectedValue(
        new Error("User not found"),
      );

      const result = await pondUserController.getPondUserById(999);
      expect(result).toBeNull();
    });
  });

  describe("updateUserLocation", () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;

    beforeEach(() => {
      mockRequest = {
        user: { id: 1 } as PondUser,
        params: { location: "New Location" },
      };
      mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
    });

    it("should update user location successfully", async () => {
      const updatedUser = {
        id: 1,
        location: "New Location",
      } as unknown as PondUser;
      mockPondUserService.updateUserLocation.mockResolvedValue(updatedUser);

      await pondUserController.updateUserLocation(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(updatedUser);
    });

    it("should return an error if location is not provided", async () => {
      mockRequest.params = {};

      await pondUserController.updateUserLocation(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith(
        new Error("No location paramter in request"),
      );
    });
  });

  describe("updateUsername", () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;

    beforeEach(() => {
      mockRequest = {
        user: { id: 1 } as PondUser,
        body: { newUsername: "newusername" },
      };
      mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
    });

    it("should update username successfully", async () => {
      mockPondUserService.updateUsername.mockResolvedValue(
        undefined as unknown as PondUser,
      );

      await pondUserController.updateUsername(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        updated: true,
        error: "",
      });
    });

    it("should return an error if new username is too short", async () => {
      mockRequest.body.newUsername = "ab";

      await pondUserController.updateUsername(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        updated: false,
        error: "Username length must be between 3 and 20",
      });
    });

    it('should return an error if new username starts with "guest-"', async () => {
      mockRequest.body.newUsername = "guest-user";

      await pondUserController.updateUsername(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        updated: false,
        error: 'Username cannot begin with "guest-"',
      });
    });
  });

  describe("getUserFish", () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;

    beforeEach(() => {
      mockRequest = {
        user: { id: 1 } as PondUser,
      };
      mockResponse = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
    });

    it("should return user fish successfully", async () => {
      const mockUserFish = [{ id: 1, name: "Nemo" }];
      mockPondUserService.getUserFish.mockResolvedValue(
        mockUserFish as unknown as UserFish[],
      );

      await pondUserController.getUserFish(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(mockResponse.json).toHaveBeenCalledWith(mockUserFish);
    });

    it("should return an error if user is not authenticated", async () => {
      mockRequest.user = undefined;

      await pondUserController.getUserFish(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
    });
  });

  describe("getTopHundredPondUsersByExp", () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;

    beforeEach(() => {
      mockRequest = {};
      mockResponse = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
    });

    it("should return top hundred pond users successfully", async () => {
      const mockTopUsers = [
        { id: 1, username: "top1", exp: 1000 },
        { id: 2, username: "top2", exp: 900 },
      ] as unknown as PondUser[];
      mockPondUserService.getTopPondUsers.mockResolvedValue(mockTopUsers);

      await pondUserController.getTopHundredPondUsersByExp(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockTopUsers);
      expect(mockPondUserService.getTopPondUsers).toHaveBeenCalledWith(
        "exp",
        "desc",
        100,
      );
    });

    it("should return an error if fetching top users fails", async () => {
      const mockError = new Error("Failed to fetch top users");
      mockPondUserService.getTopPondUsers.mockRejectedValue(mockError);

      await pondUserController.getTopHundredPondUsersByExp(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith(mockError);
    });
  });
});
