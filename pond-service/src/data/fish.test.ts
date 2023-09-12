import fishJson from './fish.json';

test('validate fish json data', () => {
  const fishSet = new Set();
  const validateFish = (element: any, lastId: number): number => {
    if (element.id <= lastId) {
      throw new Error(`Fish id ${element.id} is not in order`);
    }
    if (!('id' in element)) {
      throw new Error(`A fish does not have an id`);
    }
    if (fishSet.has(element.id)) {
      throw new Error(`Fish id ${element.id} is a duplicate`);
    }
    if (!('name' in element)) {
      throw new Error(`Fish id ${element.id} does not have a name`);
    }
    if (!('description' in element)) {
      throw new Error(`Fish id ${element.id} does not have a description`);
    }
    if (!('lengthRangeInCm' in element)) {
      throw new Error(`Fish id ${element.id} does not have a lengthRangeInCm`);
    }
    if (!('secondsFishable' in element)) {
      throw new Error(`Fish id ${element.id} does not have a secondsFishable`);
    }
    if (!('expRewarded' in element)) {
      throw new Error(`Fish id ${element.id} does not have a expRewarded`);
    }
    if (!('rarity' in element)) {
      throw new Error(`Fish id ${element.id} does not have a rarirty`);
    }
    if (!('active' in element)) {
      throw new Error(`Fish id ${element.id} does not have an active property`);
    }
    if (element.lengthRangeInCm.length !== 2) {
      throw new Error(`Fish id ${element.id} lengthRangeInCm array is not of length 2`);
    }
    if (
      element.rarity !== 'common' &&
      element.rarity !== 'rare' &&
      element.rarity !== 'epic' &&
      element.rarity !== 'legendary'
    ) {
      throw new Error(`Fish id ${element.id} does not have a valid rarity`);
    }

    fishSet.add(element.id);
    return element.id;
  };
  let lastId = -1;
  fishJson.forEach((fish) => {
    lastId = validateFish(fish, lastId);
  });
});
