import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { AppIcon } from '../app-icon/app-icon';

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
  readonly applied = output<void>();
  readonly reset = output<void>();
  readonly closed = output<void>();

  protected readonly headingId = computed(() => `${this.panelId()}-title`);
}
