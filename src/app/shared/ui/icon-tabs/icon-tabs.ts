import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { AppIcon } from '../app-icon/app-icon';
import { IconTab } from './icon-tab';

const SELECTED_CLASSES = 'border-primary text-primary';
const IDLE_CLASSES = 'border-transparent text-text-secondary hover:text-text-primary';

/** A row of underlined tabs, each led by its icon, over a full-width rule. */
@Component({
  selector: 'app-icon-tabs',
  imports: [AppIcon],
  templateUrl: './icon-tabs.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconTabs {
  readonly tabs = input.required<readonly IconTab[]>();
  readonly selected = input.required<string>();
  readonly selectedChange = output<string>();

  protected readonly selectedClasses = SELECTED_CLASSES;
  protected readonly idleClasses = IDLE_CLASSES;
}
