import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  OnInit,
  afterNextRender,
  inject,
  Injector,
  input,
  signal,
  viewChildren,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { emptyResetCode, joinResetCode, typeIntoResetCode } from '../../forms/reset-code-digits';

@Component({
  selector: 'app-reset-code-field',
  templateUrl: './reset-code-field.html',
  host: { class: 'block w-full' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetCodeField implements OnInit {
  readonly control = input.required<FormControl<string>>();
  /** Id of the visible "أدخل الرمز" label that names the six boxes. */
  readonly labelId = input.required<string>();

  private readonly destroyRef = inject(DestroyRef);
  private readonly injector = inject(Injector);
  private readonly boxes = viewChildren<ElementRef<HTMLInputElement>>('box');

  protected readonly digits = signal<readonly string[]>(emptyResetCode());

  ngOnInit(): void {
    const subscription = this.control().valueChanges.subscribe((value) => {
      if (value !== joinResetCode(this.digits())) {
        this.digits.set(typeIntoResetCode(emptyResetCode(), 0, value ?? '').digits);
      }
    });
    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  protected onType(index: number, box: HTMLInputElement): void {
    const typed = typeIntoResetCode(this.digits(), index, box.value);
    box.value = typed.digits[index];
    this.digits.set(typed.digits);
    this.control().setValue(joinResetCode(typed.digits));
    this.control().markAsDirty();
    this.focusBox(typed.nextIndex);
  }

  protected onKeydown(index: number, event: KeyboardEvent): void {
    const isEmptyBackspace = event.key === 'Backspace' && this.digits()[index] === '';
    if (isEmptyBackspace && index > 0) {
      event.preventDefault();
      this.focusBox(index - 1);
    }
  }

  protected selectDigit(box: HTMLInputElement): void {
    box.select();
  }

  private focusBox(index: number): void {
    const focus = () => this.boxes()[index]?.nativeElement.focus();
    focus();
    afterNextRender(focus, { injector: this.injector });
  }
}
