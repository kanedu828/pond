import FishingService from './fishingService';
import { Fish } from '../data/fishTypes';
import * as util from '../util/util';
import PondUserDao from '../dao/pondUserDao';
import FishDao from '../dao/fishDao';

const mockUser = {
  id: 1,
  username: 'test-user',
  exp: 1,
  location: 'Pond'
};

jest.mock('../dao/pondUserDao');

const mockPondUserDao: jest.Mocked<PondUserDao> = {
  db: jest.fn(),
  getPondUser: jest.fn().mockResolvedValue(mockUser),
  insertPondUser: jest.fn(),
  updatePondUser: jest.fn(),
  incrementPondUserExp: jest.fn(),
  getTopPondUsers: jest.fn()
};

jest.mock('../dao/fishDao');

const mockFishDao: jest.Mocked<FishDao> = {
  db: jest.fn(),
  getFish: jest.fn(),
  insertFish: jest.fn(),
  updateFish: jest.fn()
};

const fishingService = new FishingService(mockPondUserDao, mockFishDao);

const mockFish: Fish = {
  id: 1,
  name: 'test fish',
  description: 'test fish',
  lengthRangeInCm: [1, 3],
  expRewarded: 1,
  rarity: 'rare',
  secondsFishable: 1,
  active: true
};

jest.spyOn(util, 'getRandomArrayElement').mockReturnValue(mockFish);
jest.spyOn(util, 'getRandomInt').mockReturnValue(1);
jest.spyOn(util, 'sleep').mockResolvedValue(null);
jest.spyOn(util, 'randomNormal').mockReturnValue(2);
jest.spyOn(util, 'getRandomRarity').mockReturnValue('rare');
jest.spyOn(Date, 'now').mockReturnValue(0);

beforeEach(() => {
  fishingService.userCurrentFish.delete(1);
  fishingService.nextFishDue.delete(1);
  mockFishDao.insertFish.mockClear();
});

describe('Test pollFish', () => {
  it('user already has a fish', async () => {
    const mockFishInstance = {
      ...mockFish,
      length: 2,
      expirationDate: 1000
    };
    fishingService.userCurrentFish.set(1, mockFishInstance);
    const result = await fishingService.pollFish(1, 1, 2);
    expect(result).toStrictEqual(mockFishInstance);
  });

  it('fish due time is expired', async () => {
    fishingService.nextFishDue.set(1, -999999);
    const result = await fishingService.pollFish(1, 1, 2);
    expect(fishingService.nextFishDue.get(1)).toBe(1000);
    expect(result).toBe(null);
  });

  it('fish is due on time', async () => {
    fishingService.nextFishDue.set(1, -1);
    const result = await fishingService.pollFish(1, 1, 2);
    const mockFishInstance = {
      ...mockFish,
      length: 2,
      expirationDate: 1000
    };
    expect(result).toStrictEqual(mockFishInstance);
  });
});

describe('Test getFish', () => {
  it('user does not have current fish', async () => {
    const expectedResult = {
      ...mockFish,
      expirationDate: 1000,
      length: 2
    };
    const fish = await fishingService.getFish(1, 1, 1, 2);
    expect(fish).toStrictEqual(expectedResult);
  });

  it('user does have current fish', async () => {
    const mockFishInstance = {
      ...mockFish,
      length: 2,
      expirationDate: 1000
    };
    fishingService.userCurrentFish.set(1, mockFishInstance);
    const fish = await fishingService.getFish(1, 1, 1, 2);
    expect(fish).toBe(fishingService.userCurrentFish.get(1));
  });

  it('user has invalid location', async () => {
    mockPondUserDao.getPondUser = jest.fn().mockResolvedValueOnce({
      id: 1,
      username: 'test-user',
      exp: 1,
      location: 'asdfasdf'
    });
    const expectedResult = {
      ...mockFish,
      expirationDate: 1000,
      length: 2
    };
    const fish = await fishingService.getFish(1, 1, 1, 2);
    expect(fish).toStrictEqual(expectedResult);
  });
});

describe('Test collectFish', () => {
  it('user has current fish but no collected fish', async () => {
    mockFishDao.getFish = jest.fn().mockResolvedValueOnce([]);
    const mockFishInstance = {
      ...mockFish,
      length: 2,
      expirationDate: 1000
    };
    fishingService.userCurrentFish.set(1, mockFishInstance);
    const result = await fishingService.collectFish(1);
    expect(result).toStrictEqual(mockFishInstance);
    expect(fishingService.userCurrentFish.get(1)).toBe(undefined);
    expect(mockFishDao.updateFish).toHaveBeenCalledTimes(0);
    expect(mockFishDao.insertFish).toHaveBeenCalledTimes(1);
  });

  it('user has current fish and has collected fish', async () => {
    mockFishDao.getFish = jest.fn().mockResolvedValueOnce([
      {
        id: 1,
        pond_user_id: 1,
        count: 1,
        length: 1
      }
    ]);
    const mockFishInstance = {
      ...mockFish,
      length: 2,
      expirationDate: 1000
    };
    fishingService.userCurrentFish.set(1, mockFishInstance);
    const result = await fishingService.collectFish(1);
    expect(result).toStrictEqual(mockFishInstance);
    expect(fishingService.userCurrentFish.get(1)).toBe(undefined);
    expect(mockFishDao.updateFish).toHaveBeenCalledTimes(1);
    expect(mockFishDao.insertFish).toHaveBeenCalledTimes(0);
  });

  it('user has no current fish', async () => {
    const result = await fishingService.collectFish(1);
    expect(result).toBe(null);
  });
});

describe('Test getCurrentFish', () => {
  it('user has non expired fish', () => {
    const mockFishInstance = {
      ...mockFish,
      length: 2,
      expirationDate: 1000
    };
    fishingService.userCurrentFish.set(1, mockFishInstance);
    const result = fishingService.getCurrentFish(1);
    expect(result).toStrictEqual(mockFishInstance);
  });

  it('user has expired fish', () => {
    const mockFishInstance = {
      ...mockFish,
      length: 2,
      expirationDate: -1000
    };
    fishingService.userCurrentFish.set(1, mockFishInstance);
    const result = fishingService.getCurrentFish(1);
    expect(result).toBe(null);
  });

  it('user has no fish', () => {
    const result = fishingService.getCurrentFish(1);
    expect(result).toBe(null);
  });
});

describe('Test getLastConnectedSocketId', () => {
  it('does not have existing socket id', () => {
    const result = fishingService.updateConnectedSocketId(1, 1);
    expect(result).toBe(null);
  });

  it('has existing socket io', () => {
    fishingService.connectedUsers.set(1, 1);
    const result = fishingService.updateConnectedSocketId(1, 1);
    expect(result).toBe(1);
  });
});
