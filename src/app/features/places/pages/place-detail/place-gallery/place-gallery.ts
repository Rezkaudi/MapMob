import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { AppIcon } from '../../../../../shared/ui/app-icon/app-icon';
import { LazyImage } from '../../../../../shared/ui/lazy-image/lazy-image';

const THUMBNAIL_COUNT = 2;

@Component({
  selector: 'app-place-gallery',
  imports: [AppIcon, LazyImage],
  templateUrl: './place-gallery.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaceGallery {
  readonly images = input.required<readonly string[]>();
  readonly name = input.required<string>();

  protected readonly coverImage = computed(() => this.images()[0] ?? '');
  protected readonly thumbnails = computed(() => this.images().slice(1, 1 + THUMBNAIL_COUNT));
}
