import { createAccountProfileFormGroup, toAccountProfileDraft } from './account-profile-form-group';

describe('account profile form', () => {
  it('needs a name and a valid email', () => {
    const form = createAccountProfileFormGroup();
    expect(form.valid).toBe(false);

    form.setValue({ fullName: '   ', email: 'khawla@mapmob' });
    expect(form.controls.fullName.valid).toBe(false);
    expect(form.controls.email.valid).toBe(false);

    form.setValue({ fullName: 'خولة محمد', email: 'khawla.mo@mapmob.com' });
    expect(form.valid).toBe(true);
  });

  it('trims the values it sends', () => {
    expect(toAccountProfileDraft({ fullName: ' خولة ', email: ' k@mapmob.com ' })).toEqual({
      fullName: 'خولة',
      email: 'k@mapmob.com',
    });
  });
});
