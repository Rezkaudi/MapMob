import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';

/**
 * Shows the day as the design writes it ("2026-08-01") whatever the browser locale, with the
 * native date input laid invisibly over the field so the system picker still does the picking.
 */
@Component({
  selector: 'app-date-field',
  imports: [AppIcon],
  templateUrl: './date-field.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DateField {
  readonly label = input.required<string>();
  /** A day written `yyyy-mm-dd`. */
  readonly value = input<string | null>(null);
  readonly min = input<string | null>(null);
  readonly max = input<string | null>(null);
  readonly valueChange = output<string | null>();

  protected onChange(event: Event): void {
    const picked = (event.target as HTMLInputElement).value;
    this.valueChange.emit(picked === '' ? null : picked);
  }

  /** Chromium only opens the picker from its own small icon, so a click anywhere asks for it. */
  protected openPicker(event: Event): void {
    try {
      (event.target as HTMLInputElement).showPicker();
    } catch {
      // Browsers without `showPicker` fall back to their own behaviour.
    }
  }
}
