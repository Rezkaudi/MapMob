import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { StoryVisibilityAction } from '../../../../shared/models/story-visibility-action';
import { ActionMenu } from '../../../../shared/ui/action-menu/action-menu';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';

interface VisibilityItem {
  readonly label: string;
  readonly icon: string;
}

const VISIBILITY_ITEMS: Record<StoryVisibilityAction, VisibilityItem> = {
  hide: { label: 'إخفاء القصة', icon: 'eye-hide' },
  show: { label: 'إظهار القصة', icon: 'eye-clarity' },
};

/** The item above the rule keeps 12px under its label, as the frame draws it. */
const LAST_ITEM_PADDING = 'pt-2 pb-3';
const ITEM_PADDING = 'py-2';

/** The dots of a table row and the menu they open: view, hide or show, and delete. */
@Component({
  selector: 'app-story-row-menu',
  imports: [ActionMenu, AppIcon],
  templateUrl: './story-row-menu.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoryRowMenu {
  /** null for a story that has run out: there is nothing left to hide or show. */
  readonly visibilityAction = input.required<StoryVisibilityAction | null>();
  readonly view = output<void>();
  readonly visibilityChange = output<void>();
  readonly remove = output<void>();

  protected readonly lastItemPadding = LAST_ITEM_PADDING;
  protected readonly visibilityItem = computed(() => {
    const action = this.visibilityAction();
    return action ? VISIBILITY_ITEMS[action] : null;
  });
  protected readonly viewPadding = computed(() =>
    this.visibilityItem() ? ITEM_PADDING : LAST_ITEM_PADDING,
  );
}
