import { expToLevel, levelToExp } from "./exp";

describe("test exp functions", () => {
  it("exp to level are equal", () => {
    const expectedExp = 1047;
    const expectedLevel = 22;
    const exp = levelToExp(expectedLevel);
    const level = expToLevel(expectedExp);
    expect(exp).toEqual(expectedExp);
    expect(level).toEqual(expectedLevel);
  });
});
