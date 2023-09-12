export const getRandomInt = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1) + min);

export const sleep = (milliseconds: number) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

// Code from stack overflow to give random value based off of a
// normal distribution. Used to get random lenght of fish.
export const randomNormal = (min: number, max: number) => {
  let u = 0;
  let v = 0;
  while (u === 0) u = Math.random(); // Converting [0,1) to (0,1)
  while (v === 0) v = Math.random();
  let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);

  num = num / 10.0 + 0.5; // Translate to 0 -> 1
  if (num > 1 || num < 0) num = randomNormal(min, max); // resample between 0 and 1 if out of range
  else {
    num *= max - min; // Stretch to fill range
    num += min; // offset to min
  }
  return num;
};

export const getRandomRarity = (): string => {
  const randomNumber = Math.random();
  let rarity: string;
  if (randomNumber <= 0.6) {
    rarity = 'common';
  } else if (randomNumber <= 0.9) {
    rarity = 'rare';
  } else if (randomNumber <= 0.98) {
    rarity = 'epic';
  } else {
    rarity = 'legendary';
  }
  return rarity;
};

export const getRandomArrayElement = (arr: any[]): any =>
  arr[Math.floor(Math.random() * arr.length)];

export const binarySearch = <Type>(
  arr: Type[],
  target: any,
  // eslint-disable-next-line no-unused-vars
  func: (element: Type) => any
): number => {
  let low = 0;
  let high = arr.length - 1;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const value = func(arr[mid]);
    if (value < target) {
      low = mid + 1;
    } else if (value > target) {
      high = mid - 1;
    } else {
      return mid;
    }
  }
  return -1;
};
