import { ChangeDetectionStrategy, Component, computed, effect, input, signal } from '@angular/core';
import { Skeleton, SkeletonShape } from '../skeleton/skeleton';

/**
 * A picture that shimmers while it downloads and shows the projected content
 * when it cannot be downloaded at all.
 */
@Component({
  selector: 'app-lazy-image',
  imports: [Skeleton],
  templateUrl: './lazy-image.html',
  host: { class: 'relative block overflow-hidden' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LazyImage {
  readonly src = input.required<string>();
  readonly alt = input<string>('');
  /** Classes for the `img` itself, so each caller keeps its own shape and fit. */
  readonly imageClass = input<string>('');
  readonly skeletonShape = input<SkeletonShape>('rect');

  private readonly loaded = signal(false);
  private readonly failed = signal(false);

  protected readonly isLoaded = this.loaded.asReadonly();
  protected readonly hasFailed = this.failed.asReadonly();

  protected readonly imageClasses = computed(() =>
    this.loaded()
      ? `${this.imageClass()} transition-opacity duration-300`
      : `${this.imageClass()} opacity-0 transition-opacity duration-300`,
  );

  constructor() {
    // A new source starts a new download, so the placeholder comes back.
    effect(() => {
      this.src();
      this.loaded.set(false);
      this.failed.set(false);
    });
  }

  protected markLoaded(): void {
    this.loaded.set(true);
  }

  protected markFailed(): void {
    this.failed.set(true);
  }
}
