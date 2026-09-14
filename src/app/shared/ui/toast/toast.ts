import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { AppIcon } from '../app-icon/app-icon';

export type ToastTone = 'success' | 'error';

const TONE_CLASSES: Record<ToastTone, string> = {
  success: 'bg-success-soft text-success',
  error: 'bg-error-soft text-error',
};

const TONE_ICONS: Record<ToastTone, string> = {
  success: 'check',
  error: 'info',
};

/** The 476×76 confirmation card the design floats over the page after a save. */
@Component({
  selector: 'app-toast',
  imports: [AppIcon],
  templateUrl: './toast.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Toast {
  readonly title = input.required<string>();
  readonly message = input.required<string>();
  readonly tone = input<ToastTone>('success');
  readonly dismissed = output<void>();

  protected readonly toneClasses = TONE_CLASSES;
  protected readonly toneIcons = TONE_ICONS;
}
