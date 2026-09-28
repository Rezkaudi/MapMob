import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { AppIcon } from '../app-icon/app-icon';

/** `regular` is the 65px footer of the offers and ads panels; `compact` the notifications frame's 49px one. */
export type FilterPopoverFooterSize = 'regular' | 'compact';

const FOOTER_HEIGHTS: Record<FilterPopoverFooterSize, string> = {
  regular: 'h-[65px]',
  compact: 'h-[49px]',
};

/** `tinted` is the admin panels' grey 16px header; `plain` the owner offers frame's white 12px one. */
export type FilterPopoverHeaderAppearance = 'tinted' | 'plain';

const HEADER_CLASSES: Record<FilterPopoverHeaderAppearance, string> = {
  tinted: 'bg-surface-muted/70 px-5 py-4',
  plain: 'px-3 pb-3',
};

/** The 384px card under "الفلاتر" on the offers and ads pages: heading, groups, reset and apply. */
@Component({
  selector: 'app-filter-popover',
  imports: [AppIcon],
  templateUrl: './filter-popover.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterPopover {
  /** Matches the toolbar's `panelId`, so its button can point at this dialog. */
  readonly panelId = input.required<string>();
  readonly heading = input.required<string>();
  readonly canApply = input<boolean>(true);
  readonly footerSize = input<FilterPopoverFooterSize>('regular');
  readonly headerAppearance = input<FilterPopoverHeaderAppearance>('tinted');
  readonly applied = output<void>();
  readonly reset = output<void>();
  readonly closed = output<void>();

  protected readonly footerHeight = computed(() => FOOTER_HEIGHTS[this.footerSize()]);
  protected readonly headerClasses = computed(() => HEADER_CLASSES[this.headerAppearance()]);
  protected readonly headingId = computed(() => `${this.panelId()}-title`);
}
