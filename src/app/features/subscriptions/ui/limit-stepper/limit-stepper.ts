import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { UNLIMITED_LIMIT } from '../../state/plan-form-group';

const UNLIMITED_LABEL = 'غير محدود';
const SMALLEST_LIMIT = 0;

/** One allowance in "حدود الاستخدام": a tag, a name and a −/+ number box. */
@Component({
  selector: 'app-limit-stepper',
  templateUrl: './limit-stepper.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LimitStepper {
  readonly label = input.required<string>();
  readonly tag = input.required<string>();
  /** Tailwind classes for the tag chip, one colour per kind of content. */
  readonly tagClasses = input.required<string>();
  readonly control = input.required<FormControl<number>>();

  protected readonly unlimitedLabel = UNLIMITED_LABEL;
  protected readonly unlimited = UNLIMITED_LIMIT;

  /** Stepping below zero reaches "غير محدود", which the form stores as -1. */
  protected step(by: number): void {
    const next = this.control().value + by;
    this.control().setValue(Math.max(next, UNLIMITED_LIMIT));
  }

  protected typeValue(event: Event): void {
    const typed = Number((event.target as HTMLInputElement).value);
    this.control().setValue(
      Number.isFinite(typed) ? Math.max(typed, SMALLEST_LIMIT) : SMALLEST_LIMIT,
    );
  }
}
