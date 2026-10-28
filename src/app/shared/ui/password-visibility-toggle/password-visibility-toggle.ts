import { ChangeDetectionStrategy, Component, computed, input, model } from '@angular/core';
import { AppIcon } from '../app-icon/app-icon';

const SHOW_PASSWORD_LABEL = 'إظهار كلمة المرور';
const HIDE_PASSWORD_LABEL = 'إخفاء كلمة المرور';
const DEFAULT_ICON_SIZE_PX = 16;

@Component({
  selector: 'button[appPasswordVisibilityToggle]',
  imports: [AppIcon],
  templateUrl: './password-visibility-toggle.html',
  host: {
    type: 'button',
    '[attr.aria-label]': 'toggleLabel()',
    '[attr.aria-pressed]': 'isVisible()',
    '(click)': 'toggleVisibility()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordVisibilityToggle {
  readonly isVisible = model(false);

  /** The place form's 46px fields draw the eye at 20px. */
  readonly iconSize = input<number>(DEFAULT_ICON_SIZE_PX);
  protected readonly toggleLabel = computed(() =>
    this.isVisible() ? HIDE_PASSWORD_LABEL : SHOW_PASSWORD_LABEL,
  );

  protected toggleVisibility(): void {
    this.isVisible.update((isVisible) => !isVisible);
  }
}
