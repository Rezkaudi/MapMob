import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';
import { Spinner } from '../../../../shared/ui/spinner/spinner';
import { AuthStore } from '../../state/auth.store';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, AppIcon, Spinner],
  templateUrl: './login.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login {
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
  protected readonly store = inject(AuthStore);

  protected readonly isPasswordVisible = signal(false);

  protected readonly form = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  constructor() {
    effect(() => {
      if (this.store.isSignedIn()) {
        this.router.navigateByUrl('/dashboard');
      }
    });
  }

  protected togglePasswordVisibility(): void {
    this.isPasswordVisible.update((visible) => !visible);
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.store.signIn(this.form.getRawValue());
  }
}
