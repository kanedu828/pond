import { binarySearch } from './util';

describe('Test binarySearch', () => {
  it('Test binary search when target exists', () => {
    const arr = [1, 2, 3, 5, 7, 8, 9, 10, 11];
    const result = binarySearch<number>(arr, 10, (element: number) => element);
    expect(result).toBe(7);
  });

  it('Test binary search when target does not exist', () => {
    const arr = [1, 2, 3, 5, 7, 8, 9, 10, 11];
    const result = binarySearch<number>(arr, 4, (element: number) => element);
    expect(result).toBe(-1);
  });

  it('Test binary search when target is first element', () => {
    const arr = [1, 2, 3, 5, 7, 8, 9, 10, 11];
    const result = binarySearch<number>(arr, 1, (element: number) => element);
    expect(result).toBe(0);
  });

  it('Test binary search when target is last element', () => {
    const arr = [1, 2, 3, 5, 7, 8, 9, 10, 11];
    const result = binarySearch<number>(arr, 11, (element: number) => element);
    expect(result).toBe(8);
  });
});
