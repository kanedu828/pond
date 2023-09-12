import PondUserService from './pondUserService';
import PondUserDao from '../dao/pondUserDao';
import FishDao from '../dao/fishDao';

const mockUser = {
  id: 123,
  username: 'test-user',
  exp: 1,
  location: 'default'
};

jest.mock('../dao/pondUserDao');

const mockPondUserDao: jest.Mocked<PondUserDao> = {
  db: jest.fn(),
  getPondUser: jest.fn(),
  insertPondUser: jest.fn(),
  updatePondUser: jest.fn(),
  incrementPondUserExp: jest.fn(),
  getTopPondUsers: jest.fn()
};

const mockFishDao: jest.Mocked<FishDao> = {
  db: jest.fn(),
  getFish: jest.fn(),
  updateFish: jest.fn(),
  insertFish: jest.fn()
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

describe('Test getOrCreatePondUser', () => {
  it('user id exists', async () => {
    const expectedUser = {
      id: 123,
      username: 'test-user',
      exp: 1,
      location: 'default'
    };
    mockPondUserDao.getPondUser.mockResolvedValueOnce(mockUser);
    mockPondUserDao.insertPondUser.mockResolvedValueOnce(mockUser);
    const results = await pondUserService.getOrCreatePondUser('my-google-id', 'test@example.com');
    expect(results).toStrictEqual(expectedUser);
    expect(mockPondUserDao.insertPondUser).toHaveBeenCalledTimes(0);
  });

  it('user id does not exist', async () => {
    const expectedUser = {
      id: 123,
      username: 'test-user',
      exp: 1,
      location: 'default'
    };
    mockPondUserDao.getPondUser.mockResolvedValueOnce(null);
    mockPondUserDao.insertPondUser.mockResolvedValueOnce(mockUser);
    const results = await pondUserService.getOrCreatePondUser('my-google-id', 'test@example.com');
    expect(results).toStrictEqual(expectedUser);
    expect(mockPondUserDao.insertPondUser).toHaveBeenCalledTimes(1);
  });
});

describe('test getUserFish', () => {
  it('user has fish', async () => {
    const fishArray = [
      {
        id: 1,
        fish_id: 1,
        pond_user_id: 1,
        max_length: 10,
        count: 5
      },
      {
        id: 2,
        fish_id: 2,
        pond_user_id: 1,
        max_length: 5,
        count: 2
      }
    ];
    const expectedFishArray = [
      {
        fishId: 1,
        pondUserId: 1,
        maxLength: 10,
        count: 5
      },
      {
        fishId: 2,
        pondUserId: 1,
        maxLength: 5,
        count: 2
      }
    ];
    mockFishDao.getFish.mockResolvedValueOnce(fishArray);
    const results = await pondUserService.getUserFish(1);
    expect(results).toStrictEqual(expectedFishArray);
  });
});
