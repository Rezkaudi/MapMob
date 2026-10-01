import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';
import { StoryCardView } from '../../models/story-card-view';
import { StoryMenu } from '../story-menu/story-menu';
import { StoryVisual } from '../../../../shared/ui/story-visual/story-visual';

/** One story still showing: the 9:16 picture over its publish time and views. */
@Component({
  selector: 'app-active-story-card',
  imports: [AppIcon, StoryMenu, StoryVisual],
  templateUrl: './active-story-card.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActiveStoryCard {
  readonly card = input.required<StoryCardView>();
  readonly view = output<void>();
  readonly edit = output<void>();
  readonly remove = output<void>();
}
