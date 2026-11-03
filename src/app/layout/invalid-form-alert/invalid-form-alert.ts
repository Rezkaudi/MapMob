import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  Injector,
  afterNextRender,
  inject,
  signal,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { findFirstInvalidField } from '../../shared/forms/find-first-invalid-field';
import { revealField } from '../../shared/forms/reveal-field';
import { Toast } from '../../shared/ui/toast/toast';

const ALERT_DURATION_MS = 5000;
/** Marks a non-submit button, such as "save as draft", that also saves the form. */
const CHECKS_FORM_SELECTOR = 'form [data-checks-form]';
// A draft may save with a red warning showing, so only a truly invalid form counts.
const INVALID_FORM_SELECTOR = 'form.ng-invalid';

/** After any form submit, takes the user to the first empty or wrong field and says why nothing was saved. */
@Component({
  selector: 'app-invalid-form-alert',
  imports: [Toast],
  templateUrl: './invalid-form-alert.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvalidFormAlert {
  protected readonly isShown = signal(false);
  private readonly injector = inject(Injector);
  private hideTimer: ReturnType<typeof setTimeout> | undefined;

  constructor() {
    const document = inject(DOCUMENT);
    const checkSubmittedForm = (event: Event): void =>
      this.checkAfterRender(event.target as HTMLElement);
    const checkFormOfButton = (event: Event): void => {
      const button = (event.target as Element).closest(CHECKS_FORM_SELECTOR);
      const form = button?.closest(INVALID_FORM_SELECTOR);
      if (form instanceof HTMLElement) {
        this.checkAfterRender(form);
      }
    };
    document.addEventListener('submit', checkSubmittedForm);
    document.addEventListener('click', checkFormOfButton);
    inject(DestroyRef).onDestroy(() => {
      document.removeEventListener('submit', checkSubmittedForm);
      document.removeEventListener('click', checkFormOfButton);
      clearTimeout(this.hideTimer);
    });
  }

  protected dismiss(): void {
    clearTimeout(this.hideTimer);
    this.isShown.set(false);
  }

  /** Waits for the error messages the save just turned on. */
  private checkAfterRender(form: HTMLElement): void {
    afterNextRender(() => this.revealFirstInvalidField(form), { injector: this.injector });
  }

  private revealFirstInvalidField(form: HTMLElement): void {
    const field = findFirstInvalidField(form);
    if (!field) {
      return;
    }
    revealField(field);
    this.show();
  }

  private show(): void {
    clearTimeout(this.hideTimer);
    this.isShown.set(true);
    this.hideTimer = setTimeout(() => this.isShown.set(false), ALERT_DURATION_MS);
  }
}
