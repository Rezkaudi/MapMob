import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  HostListener,
  input,
  output,
} from '@angular/core';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-white hover:bg-primary-hover',
  secondary: 'bg-surface text-text-primary border border-border hover:bg-surface-muted',
  ghost: 'bg-transparent text-text-secondary hover:bg-surface-muted',
  danger: 'bg-error-soft text-error hover:bg-error hover:text-white',
};

const BASE_CLASSES =
  'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50';

@Component({
  selector: 'button[app-button]',
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Button {
  readonly variant = input<ButtonVariant>('primary');
  readonly buttonClick = output<MouseEvent>();

  @HostBinding('class') protected get classes(): string {
    return `${BASE_CLASSES} ${VARIANT_CLASSES[this.variant()]}`;
  }

  @HostListener('click', ['$event'])
  protected handleClick(event: MouseEvent): void {
    this.buttonClick.emit(event);
  }
}
