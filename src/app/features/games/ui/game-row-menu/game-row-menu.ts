import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ActionMenu } from '../../../../shared/ui/action-menu/action-menu';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';

/** The dots of a game row: details, and for a game still to come, edit and delete. */
@Component({
  selector: 'app-game-row-menu',
  imports: [ActionMenu, AppIcon],
  templateUrl: './game-row-menu.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameRowMenu {
  readonly canChange = input.required<boolean>();
  readonly view = output<void>();
  readonly edit = output<void>();
  readonly remove = output<void>();
}
