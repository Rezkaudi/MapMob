import { createSignInForm, describeSignInProblem } from './sign-in-form';

describe('sign-in form', () => {
  it('starts empty', () => {
    expect(createSignInForm().getRawValue()).toEqual({ email: '', password: '' });
  });

  it('asks for both fields when either is missing', () => {
    const form = createSignInForm();
    form.setValue({ email: 'a@b.com', password: '' });

    expect(describeSignInProblem(form)).toBe('أدخل البريد الإلكتروني وكلمة المرور');
  });

  it('asks for a real email', () => {
    const form = createSignInForm();
    form.setValue({ email: 'not-an-email', password: 'secret' });

    expect(describeSignInProblem(form)).toBe('أدخل بريداً إلكترونياً صحيحاً');
  });

  it('has no problem once both fields are right', () => {
    const form = createSignInForm();
    form.setValue({ email: 'a@b.com', password: 'secret' });

    expect(describeSignInProblem(form)).toBeNull();
  });
});
