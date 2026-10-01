import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ActionMenu } from '../../../../shared/ui/action-menu/action-menu';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';

/** The dark dots over a story picture and the menu they open: view, edit and delete. */
@Component({
  selector: 'app-story-menu',
  imports: [ActionMenu, AppIcon],
  templateUrl: './story-menu.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoryMenu {
  /** A story that has run out can no longer be edited. */
  readonly canEdit = input.required<boolean>();
  readonly view = output<void>();
  readonly edit = output<void>();
  readonly remove = output<void>();
}
