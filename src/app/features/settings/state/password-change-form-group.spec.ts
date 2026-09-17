import {
  PASSWORD_MIN_LENGTH,
  createPasswordChangeFormGroup,
  toPasswordChange,
} from './password-change-form-group';

describe('password change form', () => {
  it('needs the current password', () => {
    const form = createPasswordChangeFormGroup();

    form.setValue({
      currentPassword: '',
      newPassword: 'newPass1234',
      confirmPassword: 'newPass1234',
    });

    expect(form.controls.currentPassword.valid).toBe(false);
  });

  it('needs a new password of at least eight characters', () => {
    const form = createPasswordChangeFormGroup();
    const short = 'a'.repeat(PASSWORD_MIN_LENGTH - 1);

    form.controls.newPassword.setValue(short);

    expect(PASSWORD_MIN_LENGTH).toBe(8);
    expect(form.controls.newPassword.hasError('minlength')).toBe(true);
  });

  it('asks the confirmation to match the new password', () => {
    const form = createPasswordChangeFormGroup();

    form.setValue({
      currentPassword: 'currentPass123',
      newPassword: 'newPass1234',
      confirmPassword: 'newPass9999',
    });
    expect(form.controls.confirmPassword.hasError('passwordMismatch')).toBe(true);
    expect(form.valid).toBe(false);

    form.controls.confirmPassword.setValue('newPass1234');
    expect(form.valid).toBe(true);
  });

  it('rechecks the confirmation when the new password changes', () => {
    const form = createPasswordChangeFormGroup();
    form.setValue({
      currentPassword: 'currentPass123',
      newPassword: 'newPass1234',
      confirmPassword: 'newPass1234',
    });

    form.controls.newPassword.setValue('otherPass1234');

    expect(form.controls.confirmPassword.hasError('passwordMismatch')).toBe(true);
  });

  it('sends only the current and new passwords', () => {
    expect(
      toPasswordChange({
        currentPassword: 'currentPass123',
        newPassword: 'newPass1234',
        confirmPassword: 'newPass1234',
      }),
    ).toEqual({ currentPassword: 'currentPass123', newPassword: 'newPass1234' });
  });
});
