import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { ActionMenu } from '../../../../shared/ui/action-menu/action-menu';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';

/** The dots of a winner row: the game they won, and the prize delivery status. */
@Component({
  selector: 'app-winner-row-menu',
  imports: [ActionMenu, AppIcon],
  templateUrl: './winner-row-menu.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WinnerRowMenu {
  readonly view = output<void>();
  readonly statusChange = output<void>();
}
