export const RANDOM_PASSWORD_LENGTH = 12;

// 0/O, 1/l/I are left out: a merchant often reads the password off a screen or a message.
const SMALL_LETTERS = 'abcdefghijkmnopqrstuvwxyz';
const CAPITAL_LETTERS = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
const DIGITS = '23456789';
const ALL_LETTERS = SMALL_LETTERS + CAPITAL_LETTERS + DIGITS;
const REQUIRED_GROUPS = [SMALL_LETTERS, CAPITAL_LETTERS, DIGITS];
const UINT32_RANGE = 2 ** 32;

export type RandomSource = (target: Uint32Array) => Uint32Array;

const cryptoRandom: RandomSource = (target) => crypto.getRandomValues(target);

/** A number below `limit`, without the modulo bias that favours the first letters. */
function randomBelow(limit: number, random: RandomSource): number {
  const fairLimit = UINT32_RANGE - (UINT32_RANGE % limit);
  const draw = new Uint32Array(1);
  do {
    random(draw);
  } while (draw[0] >= fairLimit);
  return draw[0] % limit;
}

function pickFrom(letters: string, random: RandomSource): string {
  return letters[randomBelow(letters.length, random)];
}

function shuffle(letters: string[], random: RandomSource): string[] {
  for (let index = letters.length - 1; index > 0; index--) {
    const other = randomBelow(index + 1, random);
    [letters[index], letters[other]] = [letters[other], letters[index]];
  }
  return letters;
}

/** A strong password with at least one small letter, one capital and one digit. */
export function createRandomPassword(random: RandomSource = cryptoRandom): string {
  const letters = REQUIRED_GROUPS.map((group) => pickFrom(group, random));
  while (letters.length < RANDOM_PASSWORD_LENGTH) {
    letters.push(pickFrom(ALL_LETTERS, random));
  }
  return shuffle(letters, random).join('');
}
