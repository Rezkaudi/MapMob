import { RANDOM_PASSWORD_LENGTH, createRandomPassword } from './random-password';

/** Hands out the given numbers in turn, as crypto.getRandomValues would. */
function fixedRandom(numbers: readonly number[]) {
  let next = 0;
  return (target: Uint32Array) => {
    for (let index = 0; index < target.length; index++) {
      target[index] = numbers[next++ % numbers.length];
    }
    return target;
  };
}

describe('createRandomPassword', () => {
  it('makes a 12-letter password', () => {
    expect(RANDOM_PASSWORD_LENGTH).toBe(12);
    expect(createRandomPassword()).toHaveLength(RANDOM_PASSWORD_LENGTH);
  });

  it('always mixes small letters, capitals and digits', () => {
    for (let round = 0; round < 50; round++) {
      const password = createRandomPassword();

      expect(password).toMatch(/[a-z]/);
      expect(password).toMatch(/[A-Z]/);
      expect(password).toMatch(/[0-9]/);
    }
  });

  it('leaves out letters that are easy to misread when read aloud or copied by hand', () => {
    const everyLetter = Array.from({ length: 30 }, () => createRandomPassword()).join('');

    expect(everyLetter).not.toMatch(/[0O1lI]/);
    expect(everyLetter).toMatch(/^[A-Za-z0-9]+$/);
  });

  it('gives a new password each time', () => {
    const passwords = new Set(Array.from({ length: 20 }, () => createRandomPassword()));

    expect(passwords.size).toBe(20);
  });

  it('takes its randomness from the source it is given', () => {
    const first = createRandomPassword(fixedRandom([7, 3, 99, 12]));
    const second = createRandomPassword(fixedRandom([7, 3, 99, 12]));

    expect(first).toBe(second);
  });
});
