import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** The one-line error under a sign-in form; announced as soon as it appears. */
@Component({
  selector: 'app-auth-form-error',
  templateUrl: './auth-form-error.html',
  host: { class: 'contents' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthFormError {
  readonly message = input<string | null>(null);
}
