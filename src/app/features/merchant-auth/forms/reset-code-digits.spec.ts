import {
  RESET_CODE_LENGTH,
  emptyResetCode,
  isResetCodeComplete,
  joinResetCode,
  typeIntoResetCode,
} from './reset-code-digits';

describe('reset code digits', () => {
  it('starts with six empty boxes', () => {
    expect(emptyResetCode()).toEqual(['', '', '', '', '', '']);
    expect(RESET_CODE_LENGTH).toBe(6);
  });

  it('puts one typed digit in its box and moves to the next box', () => {
    const typed = typeIntoResetCode(emptyResetCode(), 0, '4');

    expect(typed.digits).toEqual(['4', '', '', '', '', '']);
    expect(typed.nextIndex).toBe(1);
  });

  it('ignores letters and spaces', () => {
    const typed = typeIntoResetCode(emptyResetCode(), 2, 'a ');

    expect(typed.digits).toEqual(emptyResetCode());
    expect(typed.nextIndex).toBe(2);
  });

  it('spreads a pasted code across the boxes from where it landed', () => {
    const typed = typeIntoResetCode(emptyResetCode(), 0, '12 34 56');

    expect(joinResetCode(typed.digits)).toBe('123456');
    expect(typed.nextIndex).toBe(5);
  });

  it('drops what does not fit after the last box', () => {
    const typed = typeIntoResetCode(emptyResetCode(), 4, '789');

    expect(typed.digits).toEqual(['', '', '', '', '7', '8']);
  });

  it('clears a box when its digit is deleted', () => {
    const filled = typeIntoResetCode(emptyResetCode(), 0, '123456').digits;

    const cleared = typeIntoResetCode(filled, 3, '');

    expect(cleared.digits).toEqual(['1', '2', '3', '', '5', '6']);
    expect(cleared.nextIndex).toBe(3);
  });

  it('is complete only when every box holds a digit', () => {
    expect(isResetCodeComplete(['1', '2', '3', '4', '5', ''])).toBe(false);
    expect(isResetCodeComplete(['1', '2', '3', '4', '5', '6'])).toBe(true);
  });
});
