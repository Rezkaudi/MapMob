import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { LazyImage } from '../lazy-image/lazy-image';

const INITIALS_LENGTH = 2;
const DEFAULT_SIZE_PX = 40;

@Component({
  selector: 'app-avatar',
  imports: [LazyImage],
  templateUrl: './avatar.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Avatar {
  readonly name = input.required<string>();
  readonly imageUrl = input<string | null>(null);
  readonly size = input<number>(DEFAULT_SIZE_PX);

  protected readonly initials = computed(() => this.name().trim().slice(0, INITIALS_LENGTH));
  protected readonly sizeInPixels = computed(() => `${this.size()}px`);
}
