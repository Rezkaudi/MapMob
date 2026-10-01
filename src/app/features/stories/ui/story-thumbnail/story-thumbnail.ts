import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';

/** The small 40×61 story picture of a table row; pressing it opens the story. */
@Component({
  selector: 'app-story-thumbnail',
  imports: [AppIcon],
  templateUrl: './story-thumbnail.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoryThumbnail {
  /** null keeps the dark tile, for a video the server has no still frame of yet. */
  readonly imageUrl = input.required<string | null>();
  readonly label = input.required<string>();
  readonly opened = output<void>();
}
