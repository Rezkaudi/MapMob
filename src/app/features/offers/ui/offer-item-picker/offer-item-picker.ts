import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { formatSyrianPounds } from '../../../../shared/formatting/syrian-pounds';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';
import { OfferItem } from '../../models/offer-item';

interface ItemRow {
  readonly item: OfferItem;
  readonly priceLabel: string;
  readonly isSelected: boolean;
}

/** The grey box that searches a store's products and services and ticks the ones on offer. */
@Component({
  selector: 'app-offer-item-picker',
  imports: [AppIcon],
  templateUrl: './offer-item-picker.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OfferItemPicker {
  readonly items = input.required<readonly OfferItem[]>();
  readonly selectedIds = input.required<readonly string[]>();
  readonly isLoading = input<boolean>(false);
  readonly selectedIdsChange = output<readonly string[]>();

  protected readonly search = signal('');
  protected readonly rows = computed<readonly ItemRow[]>(() => {
    const term = this.search().trim();
    const selected = new Set(this.selectedIds());
    return this.items()
      .filter((item) => !term || item.name.includes(term))
      .map((item) => ({
        item,
        priceLabel: formatSyrianPounds(item.price),
        isSelected: selected.has(item.id),
      }));
  });

  protected updateSearch(event: Event): void {
    this.search.set((event.target as HTMLInputElement).value);
  }

  protected toggle(row: ItemRow): void {
    const selectedIds = this.selectedIds();
    this.selectedIdsChange.emit(
      row.isSelected
        ? selectedIds.filter((id) => id !== row.item.id)
        : [...selectedIds, row.item.id],
    );
  }
}
