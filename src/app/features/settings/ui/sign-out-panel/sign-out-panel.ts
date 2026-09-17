import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';

/** The red strip under the account cards that ends the admin's session. */
@Component({
  selector: 'app-sign-out-panel',
  imports: [AppIcon],
  templateUrl: './sign-out-panel.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignOutPanel {
  readonly signOut = output<void>();
}
