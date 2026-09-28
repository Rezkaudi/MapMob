export const RESET_CODE_LENGTH = 6;

const NON_DIGITS = /\D/g;

export interface TypedResetCode {
  readonly digits: readonly string[];
  /** The box that should hold focus after this keystroke or paste. */
  readonly nextIndex: number;
}

export function emptyResetCode(): string[] {
  return Array.from({ length: RESET_CODE_LENGTH }, () => '');
}

/** Writes what was typed (or pasted) into the box at `index`, spilling into the boxes after it. */
export function typeIntoResetCode(
  digits: readonly string[],
  index: number,
  typedText: string,
): TypedResetCode {
  const next = [...digits];
  if (typedText === '') {
    next[index] = '';
    return { digits: next, nextIndex: index };
  }

  const typedDigits = typedText.replace(NON_DIGITS, '').split('');
  const fitting = typedDigits.slice(0, RESET_CODE_LENGTH - index);
  fitting.forEach((digit, offset) => (next[index + offset] = digit));
  const nextIndex = Math.min(index + fitting.length, RESET_CODE_LENGTH - 1);
  return { digits: next, nextIndex };
}

export function joinResetCode(digits: readonly string[]): string {
  return digits.join('');
}

export function isResetCodeComplete(digits: readonly string[]): boolean {
  return digits.length === RESET_CODE_LENGTH && digits.every((digit) => digit !== '');
}
