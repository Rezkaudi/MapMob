import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { StoryDetailView } from '../../models/story-detail-view';
import { StoryStatus } from '../../models/story-status';
import { StoryVisibilityAction } from '../../models/story-visibility-action';
import { AppIcon } from '../app-icon/app-icon';
import { SideDrawer } from '../side-drawer/side-drawer';
import { StoryVisual } from '../story-visual/story-visual';

const STATUS_DOTS: Record<StoryStatus, string> = {
  active: 'bg-status-success',
  hidden: 'bg-accent',
  expired: 'bg-text-secondary',
};

interface VisibilityButton {
  readonly label: string;
  readonly icon: string;
}

const VISIBILITY_BUTTONS: Record<StoryVisibilityAction, VisibilityButton> = {
  hide: { label: 'إخفاء القصة', icon: 'eye-hide' },
  show: { label: 'إظهار القصة', icon: 'eye-filled' },
};

/** The "عرض القصة" drawer: the story as customers see it, its facts and what can be done to it. */
@Component({
  selector: 'app-story-detail-drawer',
  imports: [AppIcon, SideDrawer, StoryVisual],
  templateUrl: './story-detail-drawer.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoryDetailDrawer {
  readonly detail = input.required<StoryDetailView>();
  /** The admin drawer adds a hide or show button beside delete; the owner's has delete alone. */
  readonly visibilityAction = input<StoryVisibilityAction | null>(null);
  readonly visibilityChange = output<void>();
  readonly remove = output<void>();
  readonly closed = output<void>();

  protected readonly statusDot = computed(() => STATUS_DOTS[this.detail().card.story.status]);
  protected readonly visibilityButton = computed(() => {
    const action = this.visibilityAction();
    return action ? VISIBILITY_BUTTONS[action] : null;
  });
}
