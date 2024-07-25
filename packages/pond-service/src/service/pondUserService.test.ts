import PondUserService from './pondUserService';
import PondUserDao from '../dao/pondUserDao';
import FishDao from '../dao/fishDao';
import { binarySearch } from '../util/util';
import { Fish } from '../../../shared/types/types';
import fishJson from '../data/fish.json';
import bcrypt from 'bcrypt';

const mockUser = {
	id: 123,
	username: 'test-user',
	exp: 1,
	location: 'default',
	is_account: true,
};

jest.mock('../dao/pondUserDao');

jest.mock('bcrypt', () => ({
	hash: jest.fn(),
	compare: jest.fn(),
}));

const mockPondUserDao: jest.Mocked<PondUserDao> = {
	db: jest.fn(),
	getPondUser: jest.fn(),
	insertPondUser: jest.fn(),
	updatePondUser: jest.fn(),
	incrementPondUserExp: jest.fn(),
	getPondUserPasswordHash: jest.fn(),
	getTopPondUsers: jest.fn(),
};

const mockFishDao: jest.Mocked<FishDao> = {
	db: jest.fn(),
	getFish: jest.fn(),
	updateFish: jest.fn(),
	insertFish: jest.fn(),
};

const pondUserService = new PondUserService(mockPondUserDao, mockFishDao);

describe(' Test getPondUser', () => {
	it('user id exists', async () => {
		mockPondUserDao.getPondUser.mockResolvedValueOnce(mockUser);
		const results = await pondUserService.getPondUser(123);
		expect(results).toBe(mockUser);
	});
});

describe(' Test getTopPondUsers', () => {
	it('user id exists', async () => {
		mockPondUserDao.getTopPondUsers.mockResolvedValueOnce([mockUser]);
		const results = await pondUserService.getTopPondUsers('exp', 'desc', 1);
		expect(results).toStrictEqual([mockUser]);
	});
});

describe('Test getOrCreateGooglePondUser', () => {
	it('user id exists', async () => {
		const expectedUser = {
			id: 123,
			username: 'test-user',
			exp: 1,
			location: 'default',
			isAccount: true,
		};
		mockPondUserDao.getPondUser.mockResolvedValueOnce(mockUser);
		mockPondUserDao.insertPondUser.mockResolvedValueOnce(mockUser);
		const results = await pondUserService.getOrCreateGooglePondUser(
			'my-google-id',
			'test@example.com',
		);
		expect(results).toStrictEqual(expectedUser);
		expect(mockPondUserDao.insertPondUser).toHaveBeenCalledTimes(0);
	});

	it('user id does not exist', async () => {
		const expectedUser = {
			id: 123,
			username: 'test-user',
			exp: 1,
			location: 'default',
			isAccount: true,
		};
		mockPondUserDao.getPondUser.mockResolvedValueOnce(null);
		mockPondUserDao.insertPondUser.mockResolvedValueOnce(mockUser);
		const results = await pondUserService.getOrCreateGooglePondUser(
			'my-google-id',
			'test@example.com',
		);
		expect(results).toStrictEqual(expectedUser);
		expect(mockPondUserDao.insertPondUser).toHaveBeenCalledTimes(1);
	});
});

describe('test getUserFish', () => {
	it('user has fish', async () => {
		const fishArray = [
			{
				id: 1000,
				fish_id: 1000,
				pond_user_id: 1,
				max_length: 10,
				count: 5,
			},
			{
				id: 1001,
				fish_id: 1001,
				pond_user_id: 1,
				max_length: 5,
				count: 2,
			},
		];
		const expectedFishArray = [
			{
				fish: fishJson[
					binarySearch(fishJson, 1000, (element: Fish) => element.id)
				],
				pondUserId: 1,
				maxLength: 10,
				count: 5,
			},
			{
				fish: fishJson[
					binarySearch(fishJson, 1001, (element: Fish) => element.id)
				],
				pondUserId: 1,
				maxLength: 5,
				count: 2,
			},
		];
		mockFishDao.getFish.mockResolvedValueOnce(fishArray);
		const results = await pondUserService.getUserFish(1);
		expect(results).toStrictEqual(expectedFishArray);
	});
});

describe('getPondUserByUsername', () => {
	it('returns existing user', async () => {
		const mockUser = {
			username: 'john',
			id: 1,
			exp: 100,
			location: 'pond',
			is_account: true,
		};
		mockPondUserDao.getPondUser.mockResolvedValue(mockUser);

		const result = await pondUserService.getPondUserByUsername('john');

		expect(mockPondUserDao.getPondUser).toHaveBeenCalledWith({
			username: 'john',
		});
		expect(result).toEqual({
			id: 1,
			username: 'john',
			exp: 100,
			location: 'pond',
			isAccount: true,
		});
	});
});

describe('createPondUser', () => {
	it('creates new user when not found', async () => {
		mockPondUserDao.getPondUser.mockResolvedValue(null);
		mockPondUserDao.insertPondUser.mockResolvedValue(mockUser);

		const result = await pondUserService.createPondUser('john', 'password123');

		expect(result).toEqual({
			id: 123,
			username: 'test-user',
			exp: 1,
			location: 'default',
			isAccount: true,
		});
	});
});

describe('getPondUserByCookie', () => {
	it('returns existing user based on cookie', async () => {
		const mockUser = {
			username: 'guest-randomstring',
			id: 1,
			exp: 100,
			location: 'pond',
			is_account: true,
		};
		mockPondUserDao.getPondUser.mockResolvedValue(mockUser);

		const result = await pondUserService.getPondUserByCookie('cookie123');

		expect(mockPondUserDao.getPondUser).toHaveBeenCalledWith({
			cookie: 'cookie123',
		});

		expect(result).toEqual({
			username: 'guest-randomstring',
			id: 1,
			exp: 100,
			location: 'pond',
			isAccount: true,
		});
	});

	it('returns null when no existing user found', async () => {
		mockPondUserDao.getPondUser.mockResolvedValue(null);

		const result = await pondUserService.getPondUserByCookie('cookie123');

		expect(mockPondUserDao.getPondUser).toHaveBeenCalledWith({
			cookie: 'cookie123',
		});
		expect(result).toBeNull();
	});
});

describe('createCookiePondUser', () => {
	it('creates new user with cookie', async () => {
		const expectedUsername = 'guest-randomstring';
		mockPondUserDao.insertPondUser.mockResolvedValue({
			username: expectedUsername,
			id: 2,
			exp: 100,
			location: 'pond',
			is_account: false,
		});

		const result = await pondUserService.createCookiePondUser('cookie123');

		expect(result).toEqual({
			id: 2,
			username: expectedUsername,
			exp: 100,
			location: 'pond',
			isAccount: false,
		});
	});
});

describe('getAuthenticatedPondUser', () => {
	it('authenticates and returns transformed user for correct password', async () => {
		const username = 'testUser';
		const password = 'correctPassword';
		const hashedPassword = 'hashedCorrectPassword';
		const mockUser = {
			id: 1,
			username,
			exp: 100,
			location: 'pond',
			is_account: true,
		};
		const transformedUser = {
			id: 1,
			username,
			exp: 100,
			location: 'pond',
			isAccount: true,
		};

		mockPondUserDao.getPondUserPasswordHash.mockResolvedValue(hashedPassword);
		(bcrypt.compare as jest.Mock).mockResolvedValue(true);
		mockPondUserDao.getPondUser.mockResolvedValue(mockUser);

		const result = await pondUserService.getAuthenticatedPondUser(
			username,
			password,
		);

		expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
		expect(mockPondUserDao.getPondUser).toHaveBeenCalledWith({ username });
		expect(result).toEqual(transformedUser);
	});

	it('returns null for incorrect password', async () => {
		const username = 'testUser';
		const password = 'incorrectPassword';
		const hashedPassword = 'hashedCorrectPassword';

		mockPondUserDao.getPondUserPasswordHash.mockResolvedValue(hashedPassword);
		(bcrypt.compare as jest.Mock).mockResolvedValue(false);

		const result = await pondUserService.getAuthenticatedPondUser(
			username,
			password,
		);

		expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
		expect(result).toBeNull();
	});
});
