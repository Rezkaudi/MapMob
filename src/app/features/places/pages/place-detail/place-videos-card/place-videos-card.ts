import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { AppIcon } from '../../../../../shared/ui/app-icon/app-icon';
import { LazyImage } from '../../../../../shared/ui/lazy-image/lazy-image';
import { SectionPanel } from '../../../../../shared/ui/section-panel/section-panel';
import { PlaceVideo } from '../../../models/place-video';

@Component({
  selector: 'app-place-videos-card',
  imports: [AppIcon, LazyImage, SectionPanel],
  templateUrl: './place-videos-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaceVideosCard {
  readonly videos = input.required<readonly PlaceVideo[]>();
  readonly addVideo = output<void>();

  /** The card shows a poster until the visitor asks to watch. */
  protected readonly playingId = signal('');

  protected play(video: PlaceVideo): void {
    this.playingId.set(video.id);
  }
}
