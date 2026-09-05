import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  HostListener,
  input,
  output,
} from '@angular/core';
import { Spinner } from '../spinner/spinner';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-white hover:bg-primary-hover',
  secondary: 'bg-surface text-text-primary border border-border hover:bg-surface-muted',
  ghost: 'bg-transparent text-text-secondary hover:bg-surface-muted',
  danger: 'bg-error-soft text-error hover:bg-error hover:text-white',
};

const BASE_CLASSES =
  'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50';

const DEFAULT_LOADING_LABEL = 'جاري التنفيذ';

@Component({
  selector: 'button[app-button]',
  imports: [Spinner],
  templateUrl: './button.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Button {
  readonly variant = input<ButtonVariant>('primary');
  readonly isLoading = input<boolean>(false);
  readonly loadingLabel = input<string>(DEFAULT_LOADING_LABEL);
  readonly buttonClick = output<MouseEvent>();

  @HostBinding('class') protected get classes(): string {
    return `${BASE_CLASSES} ${VARIANT_CLASSES[this.variant()]}`;
  }

  @HostBinding('attr.disabled') protected get disabledAttribute(): string | null {
    return this.isLoading() ? '' : null;
  }

  @HostBinding('attr.aria-busy') protected get ariaBusy(): string | null {
    return this.isLoading() ? 'true' : null;
  }

  @HostListener('click', ['$event'])
  protected handleClick(event: MouseEvent): void {
    if (this.isLoading()) {
      return;
    }
    this.buttonClick.emit(event);
  }
}
