import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';

/** The red strip under the account cards that ends the session. */
@Component({
  selector: 'app-sign-out-panel',
  imports: [AppIcon],
  templateUrl: './sign-out-panel.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignOutPanel {
  /** The admin frame adds a second line; the merchant frame draws the title alone. */
  readonly description = input<string | null>(null);
  readonly signOut = output<void>();
}
