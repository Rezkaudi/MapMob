import { FormControl, FormGroup } from '@angular/forms';
import { matchingPasswordsValidator } from './matching-passwords.validator';

function createGroup(password: string, confirmation: string) {
  return new FormGroup(
    { password: new FormControl(password), confirmation: new FormControl(confirmation) },
    { validators: matchingPasswordsValidator('password', 'confirmation') },
  );
}

describe('matchingPasswordsValidator', () => {
  it('passes when both fields match', () => {
    expect(createGroup('secret-12', 'secret-12').errors).toBeNull();
  });

  it('flags the group when the confirmation differs', () => {
    expect(createGroup('secret-12', 'secret-13').errors).toEqual({ passwordsDiffer: true });
  });

  it('waits until the confirmation is typed', () => {
    expect(createGroup('secret-12', '').errors).toBeNull();
  });
});
