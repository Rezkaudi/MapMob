import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

const DEFAULT_SIZE_PX = 20;
const BORDER_RATIO = 0.1;
const MIN_BORDER_PX = 2;
const DEFAULT_LABEL = 'جاري التحميل';

/** A spinning ring in the current text colour, for waits too short to draw a skeleton for. */
@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Spinner {
  readonly size = input<number>(DEFAULT_SIZE_PX);
  readonly label = input<string>(DEFAULT_LABEL);

  protected readonly sizeInPixels = computed(() => `${this.size()}px`);
  protected readonly borderWidthInPixels = computed(
    () => `${Math.max(MIN_BORDER_PX, Math.round(this.size() * BORDER_RATIO))}px`,
  );
}
