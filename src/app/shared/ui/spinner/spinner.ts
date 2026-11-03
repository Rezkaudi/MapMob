import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  input,
} from '@angular/core';
import { PageLock } from '../../../core/page-lock/page-lock';

const DEFAULT_SIZE_PX = 20;
const BORDER_RATIO = 0.1;
const MIN_BORDER_PX = 2;
const DEFAULT_LABEL = 'جاري التحميل';

/** A spinning ring in the current text colour. While one is on screen the page is locked. */
@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.html',
  host: {
    class: 'inline-flex shrink-0 items-center justify-center',
    role: 'status',
    '[attr.aria-label]': 'label()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Spinner {
  readonly size = input<number>(DEFAULT_SIZE_PX);
  readonly label = input<string>(DEFAULT_LABEL);

  protected readonly sizeInPixels = computed(() => `${this.size()}px`);
  protected readonly borderWidthInPixels = computed(
    () => `${Math.max(MIN_BORDER_PX, Math.round(this.size() * BORDER_RATIO))}px`,
  );

  constructor() {
    const pageLock = inject(PageLock);
    pageLock.start();
    inject(DestroyRef).onDestroy(() => pageLock.finish());
  }
}
