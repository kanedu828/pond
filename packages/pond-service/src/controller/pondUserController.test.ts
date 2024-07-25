import { Request, Response } from 'express';
import PondUserController from './pondUserController'; // Adjust the import path as needed
import PondUserService from '../service/pondUserService'; // Adjust the import path as needed
import { RegisterRequest, RegisterResponse } from '../../../shared/types/AuthTypes'; // Adjust the import path as needed
import { PondUser } from '../../../shared/types/types';

describe('PondUserController - registerUserLocal', () => {
  let pondUserController: PondUserController;
  let mockPondUserService: jest.Mocked<PondUserService>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let responseObject: any;

  beforeEach(() => {
    mockPondUserService = {
      createPondUser: jest.fn(),
    } as any;

    pondUserController = new PondUserController({} as any, {} as any);
    pondUserController.pondUserService = mockPondUserService;

    mockRequest = {
      body: {} as RegisterRequest,
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockImplementation((result) => {
        responseObject = result;
      }),
    };
  });

  it('should return error if username is less than 3 characters', async () => {
    mockRequest.body = {
      username: 'ab',
      password: 'validpassword',
    };

    await pondUserController.registerUserLocal(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(responseObject).toEqual({
      success: false,
      message: 'Your username must be atleast 3 characters long.',
    });
  });

  it('should return error if password is less than 8 characters', async () => {
    mockRequest.body = {
      username: 'validuser',
      password: 'short',
    };

    await pondUserController.registerUserLocal(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(responseObject).toEqual({
      success: false,
      message: 'Your password must be atleast 8 characters long.',
    });
  });

  it('should successfully register a user with valid input', async () => {
    mockRequest.body = {
      username: 'validuser',
      password: 'validpassword',
    };

    mockPondUserService.createPondUser.mockResolvedValue({} as PondUser);

    await pondUserController.registerUserLocal(mockRequest as Request, mockResponse as Response);

    expect(mockPondUserService.createPondUser).toHaveBeenCalledWith('validuser', 'validpassword');
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(responseObject).toEqual({
      success: true,
      message: '',
    });
  });

  it('should return error if username is already taken', async () => {
    mockRequest.body = {
      username: 'existinguser',
      password: 'validpassword',
    };

    mockPondUserService.createPondUser.mockRejectedValue(new Error('Username taken'));

    await pondUserController.registerUserLocal(mockRequest as Request, mockResponse as Response);

    expect(mockPondUserService.createPondUser).toHaveBeenCalledWith('existinguser', 'validpassword');
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(responseObject).toEqual({
      success: false,
      message: 'This username is taken!',
    });
  });
});