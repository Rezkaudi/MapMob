import { Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AbstractControl } from '@angular/forms';
import { scan } from 'rxjs';

/**
 * A number that goes up on every value, status, touched or pristine change of the form.
 * Reading it inside a `computed` lets OnPush views follow a reactive form.
 */
export function formChangeSignal(form: AbstractControl): Signal<number> {
  return toSignal(form.events.pipe(scan((count) => count + 1, 0)), { initialValue: 0 });
}
