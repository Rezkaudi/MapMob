import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';
import { StoryCardView } from '../../models/story-card-view';
import { StoryMedia } from '../story-media/story-media';
import { StoryStatusPill } from '../story-status-pill/story-status-pill';

/** `card` is the 299px story of the page; `preview` the 225px one of the drawer. */
export type StoryVisualSize = 'card' | 'preview';

interface VisualSkin {
  readonly captionText: string;
  /** The card centres the status in its 32px top bar; the drawer has a 24px one. */
  readonly statusTop: string;
}

const SKINS: Record<StoryVisualSize, VisualSkin> = {
  card: { captionText: 'text-[18px]/[29.25px]', statusTop: 'top-5' },
  preview: { captionText: 'text-[14px]/[29.25px]', statusTop: 'top-4' },
};

/** A story as the customer sees it: the 9:16 picture with its status, time left and text. */
@Component({
  selector: 'app-story-visual',
  imports: [AppIcon, StoryMedia, StoryStatusPill],
  templateUrl: './story-visual.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoryVisual {
  readonly card = input.required<StoryCardView>();
  readonly size = input<StoryVisualSize>('card');

  protected readonly skin = computed(() => SKINS[this.size()]);
  protected readonly isPlaying = computed(() => this.size() === 'preview');
}
