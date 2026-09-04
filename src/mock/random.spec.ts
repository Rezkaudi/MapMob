import { createSeededRandom, pickOne, randomInt } from './random';

describe('createSeededRandom', () => {
  it('is deterministic for the same seed', () => {
    const a = createSeededRandom(42);
    const b = createSeededRandom(42);

    expect(a()).toBe(b());
    expect(a()).toBe(b());
  });

  it('produces values between 0 and 1', () => {
    const next = createSeededRandom(7);

    for (let i = 0; i < 20; i++) {
      const value = next();
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    }
  });

  it('differs between seeds', () => {
    const a = createSeededRandom(1)();
    const b = createSeededRandom(2)();

    expect(a).not.toBe(b);
  });
});

describe('randomInt', () => {
  it('stays within the inclusive bounds', () => {
    const next = createSeededRandom(3);

    for (let i = 0; i < 50; i++) {
      const value = randomInt(next, 1, 5);
      expect(value).toBeGreaterThanOrEqual(1);
      expect(value).toBeLessThanOrEqual(5);
      expect(Number.isInteger(value)).toBe(true);
    }
  });
});

describe('pickOne', () => {
  it('always returns an item from the list', () => {
    const next = createSeededRandom(9);
    const items = ['a', 'b', 'c'] as const;

    for (let i = 0; i < 20; i++) {
      expect(items).toContain(pickOne(next, items));
    }
  });
});
