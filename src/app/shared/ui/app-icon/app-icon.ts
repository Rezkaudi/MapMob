import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

const DEFAULT_SIZE_PX = 20;

/**
 * Renders an icon exported from Figma (`public/assets/icons`) as a CSS mask, so the
 * exact glyph is kept while the colour still follows `currentColor`.
 *
 * The host is inline-flex so callers can rotate it — transforms do not apply to
 * plain inline elements.
 */
@Component({
  selector: 'app-icon',
  templateUrl: './app-icon.html',
  host: { class: 'inline-flex shrink-0' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppIcon {
  readonly name = input.required<string>();
  readonly size = input<number>(DEFAULT_SIZE_PX);

  protected readonly maskImage = computed(() => `url("assets/icons/${this.name()}.svg")`);
  protected readonly sizeInPixels = computed(() => `${this.size()}px`);
}
