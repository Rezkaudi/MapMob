import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  computed,
  input,
  output,
} from '@angular/core';
import { AppIcon } from '../app-icon/app-icon';

let nextTitleNumber = 0;

/** `form` is the ADD PRODUCT frame; `notice` the merchant review dialogs, with a bold heading. */
export type FormDialogAppearance = 'form' | 'notice';

interface FormDialogSkin {
  readonly heading: string;
  readonly subheading: string;
  readonly closeButton: string;
}

const SKINS: Record<FormDialogAppearance, FormDialogSkin> = {
  form: {
    heading: 'font-medium',
    subheading: 'mt-1 text-[13px]/[18px]',
    closeButton: 'text-text-primary',
  },
  notice: {
    heading: 'font-bold',
    subheading: 'mt-2 max-w-[368px] text-[12px]/[19.5px]',
    closeButton: 'text-text-secondary',
  },
};

/** The white 560px "ADD PRODUCT" card: heading and cross, a scrolling body, a tinted footer. */
@Component({
  selector: 'app-form-dialog-frame',
  imports: [AppIcon],
  templateUrl: './form-dialog-frame.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormDialogFrame {
  readonly heading = input.required<string>();
  /** `null` leaves the line under the heading out. */
  readonly subheading = input<string | null>(null);
  readonly appearance = input<FormDialogAppearance>('form');
  readonly closed = output<void>();

  protected readonly titleId = `form-dialog-title-${nextTitleNumber++}`;
  protected readonly skin = computed(() => SKINS[this.appearance()]);

  @HostListener('document:keydown.escape')
  protected closeOnEscape(): void {
    this.closed.emit();
  }
}
