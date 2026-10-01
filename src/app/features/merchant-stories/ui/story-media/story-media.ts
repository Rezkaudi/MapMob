import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { MerchantStory } from '../../models/merchant-story';

const PICTURE_ALT = 'صورة القصة';

/** The picture or video of one story, filling whatever box it is put in. */
@Component({
  selector: 'app-story-media',
  templateUrl: './story-media.html',
  host: { class: 'block size-full' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoryMedia {
  readonly story = input.required<MerchantStory>();
  /** The drawer plays a video; the cards only show its still frame. */
  readonly isPlaying = input<boolean>(false);

  protected readonly isVideo = computed(() => this.story().kind === 'video');
  protected readonly description = computed(() => this.story().caption ?? PICTURE_ALT);
}
