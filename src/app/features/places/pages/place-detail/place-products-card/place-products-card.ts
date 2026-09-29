import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { AppIcon } from '../../../../../shared/ui/app-icon/app-icon';
import { ActionMenu } from '../../../../../shared/ui/action-menu/action-menu';
import { SectionPanel } from '../../../../../shared/ui/section-panel/section-panel';
import { PlaceProduct } from '../../../models/place-product';
import { CurrencySymbolPipe } from '../../../../../shared/pipes/currency-symbol.pipe';
import { PRODUCT_AVAILABILITY_LABELS } from '../../../../../shared/models/product-availability';

@Component({
  selector: 'app-place-products-card',
  imports: [AppIcon, ActionMenu, SectionPanel, DecimalPipe, CurrencySymbolPipe],
  templateUrl: './place-products-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaceProductsCard {
  protected readonly labels = PRODUCT_AVAILABILITY_LABELS;
  readonly products = input.required<readonly PlaceProduct[]>();
  readonly addProduct = output<void>();
  readonly editProduct = output<PlaceProduct>();
  readonly changeStatus = output<PlaceProduct>();
  readonly removeProduct = output<PlaceProduct>();

  /** Ticked rows only; the table has no bulk action yet, so nothing reads them outside. */
  protected readonly selectedIds = signal<ReadonlySet<string>>(new Set());
  protected readonly isEveryRowSelected = computed(() => {
    const products = this.products();
    return products.length > 0 && products.every((product) => this.selectedIds().has(product.id));
  });

  protected toggleAll(isSelected: boolean): void {
    this.selectedIds.set(new Set(isSelected ? this.products().map((product) => product.id) : []));
  }

  protected toggleRow(product: PlaceProduct, isSelected: boolean): void {
    this.selectedIds.update((selected) => {
      const next = new Set(selected);
      if (isSelected) {
        next.add(product.id);
      } else {
        next.delete(product.id);
      }
      return next;
    });
  }
}
