import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';
import { StoryCardView } from '../../models/story-card-view';
import { StoryMedia } from '../../../../shared/ui/story-media/story-media';
import { StoryMenu } from '../story-menu/story-menu';
import { StoryStatusPill } from '../../../../shared/ui/story-status-pill/story-status-pill';

/** One story that has run out: the faded wide picture over its two dates and views. */
@Component({
  selector: 'app-expired-story-card',
  imports: [AppIcon, StoryMedia, StoryMenu, StoryStatusPill],
  templateUrl: './expired-story-card.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpiredStoryCard {
  readonly card = input.required<StoryCardView>();
  readonly view = output<void>();
  readonly remove = output<void>();
}
