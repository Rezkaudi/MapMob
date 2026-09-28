import { FormControl, FormGroup, Validators } from '@angular/forms';
import { INVALID_EMAIL_MESSAGE, MISSING_SIGN_IN_FIELDS_MESSAGE } from './sign-in-messages';

export type SignInForm = ReturnType<typeof createSignInForm>;

/** The email + password pair both login tabs ask for. */
export function createSignInForm() {
  return new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });
}

/** The one line to show under the form, or null when it may be sent. */
export function describeSignInProblem(form: SignInForm): string | null {
  const { email, password } = form.controls;
  if (email.hasError('required') || password.invalid) {
    return MISSING_SIGN_IN_FIELDS_MESSAGE;
  }
  return email.invalid ? INVALID_EMAIL_MESSAGE : null;
}
