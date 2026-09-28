import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  input,
  output,
  viewChild,
} from '@angular/core';

/** A white "09:00 ص" chip that opens the browser's time picker. */
@Component({
  selector: 'app-time-chip',
  templateUrl: './time-chip.html',
  host: { class: 'relative inline-flex' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimeChip {
  /** `HH:mm`. */
  readonly time = input.required<string>();
  readonly text = input.required<string>();
  readonly label = input.required<string>();
  readonly timeChange = output<string>();

  private readonly timeInput = viewChild.required<ElementRef<HTMLInputElement>>('timeInput');

  protected openPicker(): void {
    const timeInput = this.timeInput().nativeElement;
    try {
      timeInput.showPicker();
    } catch {
      // Browsers without showPicker still let the hidden field take focus and a typed time.
      timeInput.focus();
    }
  }

  protected pickFromInput(event: Event): void {
    const picked = (event.target as HTMLInputElement).value;
    if (picked) {
      this.timeChange.emit(picked);
    }
  }
}
