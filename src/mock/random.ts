export type RandomSource = () => number;

/**
 * Mulberry32 PRNG. Deterministic per seed, so mock lists look the same
 * across reloads and test runs instead of shuffling every time.
 */
export function createSeededRandom(seed: number): RandomSource {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function randomInt(next: RandomSource, min: number, max: number): number {
  return Math.floor(next() * (max - min + 1)) + min;
}

export function pickOne<T>(next: RandomSource, items: readonly T[]): T {
  return items[randomInt(next, 0, items.length - 1)];
}
