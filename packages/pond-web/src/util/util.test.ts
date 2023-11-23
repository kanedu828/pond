import { getFishImagePath, paginateArray } from './util';

describe('paginateArray function', () => {
    it('should paginate the array with the specified page size', () => {
      const jsonData = [
        { id: 1, name: 'John' },
        { id: 2, name: 'Jane' },
        { id: 3, name: 'Bob' },
        { id: 4, name: 'Alice' },
        { id: 5, name: 'Charlie' },
      ];
  
      const pageSize = 2;
      const paginatedResult = paginateArray(jsonData, pageSize);
  
      // The paginated array should have two pages
      expect(paginatedResult).toHaveLength(3);
  
      // Each page should have the specified page size
      expect(paginatedResult[0]).toHaveLength(pageSize);
      expect(paginatedResult[1]).toHaveLength(pageSize);
      expect(paginatedResult[2]).toHaveLength(pageSize);
    });
  
    it('should append empty objects to the last page if needed', () => {
      const jsonData = [
        { id: 1, name: 'John' },
        { id: 2, name: 'Jane' },
        { id: 3, name: 'Bob' },
        { id: 4, name: 'Alice' },
        { id: 5, name: 'Charlie' },
      ];
  
      const pageSize = 2;
      const paginatedResult = paginateArray(jsonData, pageSize);
  
      // The last page should have empty objects to make it of size pageSize
      expect(paginatedResult[2][1]).toEqual({});
    });
  
    it('should handle an empty array', () => {
      const jsonData: any[] = [];
      const pageSize = 2;
      const paginatedResult = paginateArray(jsonData, pageSize);
  
      // The result should be an empty array
      expect(paginatedResult).toHaveLength(0);
    });
  });

  describe('getFishImagePath', () => {

    test('converts fish name to lower case', () => {
      const path = getFishImagePath('CaRp', 1001);
      expect(path).toBe('/fishImages/carp_1001.png');
    });
  
    test('replaces spaces in fish name with underscores', () => {
      const path = getFishImagePath('Big Carp', 1001);
      expect(path).toBe('/fishImages/big_carp_1001.png');
    });
  
    test('correctly appends fish ID', () => {
      const path = getFishImagePath('Carp', 2002);
      expect(path).toBe('/fishImages/carp_2002.png');
    });
  
  });