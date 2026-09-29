import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';
import { MediaTab } from '../../models/media-tab';
import { MediaTabView } from '../../models/media-tab-view';

const ACTIVE_TAB = 'border-primary font-bold text-primary';
/** The full frame draws idle tabs bold beside their counts; the empty frame draws them medium. */
const IDLE_TAB_WITH_COUNTS = 'border-transparent font-bold text-text-secondary';
const IDLE_TAB_WITHOUT_COUNTS = 'border-transparent font-medium text-text-secondary';
const ACTIVE_BADGE = 'bg-primary-tint text-primary';
const IDLE_BADGE = 'bg-text-secondary/16 text-text-secondary';

@Component({
  selector: 'app-media-tabs',
  imports: [AppIcon],
  templateUrl: './media-tabs.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MediaTabs {
  readonly tabs = input.required<readonly MediaTabView[]>();
  readonly selected = input.required<MediaTab>();
  readonly selectTab = output<MediaTab>();

  protected readonly tabViews = computed(() => {
    const hasCounts = this.tabs().some((tab) => tab.count > 0);
    return this.tabs().map((tab) => {
      const isSelected = tab.value === this.selected();
      const idleClasses = hasCounts ? IDLE_TAB_WITH_COUNTS : IDLE_TAB_WITHOUT_COUNTS;
      return {
        ...tab,
        isSelected,
        isCountVisible: tab.count > 0,
        classes: isSelected ? ACTIVE_TAB : idleClasses,
        badgeClasses: isSelected ? ACTIVE_BADGE : IDLE_BADGE,
      };
    });
  });
}
