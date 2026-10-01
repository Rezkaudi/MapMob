import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';
import { SideDrawer } from '../../../../shared/ui/side-drawer/side-drawer';
import { StoryDetailView } from '../../models/story-detail-view';
import { StoryStatus } from '../../models/story-status';
import { StoryVisual } from '../story-visual/story-visual';

const STATUS_DOTS: Record<StoryStatus, string> = {
  active: 'bg-status-success',
  expired: 'bg-text-secondary',
};

/** The "عرض القصة" drawer: the story as customers see it, its facts and the delete button. */
@Component({
  selector: 'app-story-detail-drawer',
  imports: [AppIcon, SideDrawer, StoryVisual],
  templateUrl: './story-detail-drawer.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoryDetailDrawer {
  readonly detail = input.required<StoryDetailView>();
  readonly remove = output<void>();
  readonly closed = output<void>();

  protected readonly statusDot = computed(() => STATUS_DOTS[this.detail().card.story.status]);
}
