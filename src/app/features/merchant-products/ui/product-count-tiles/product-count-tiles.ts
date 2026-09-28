import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ProductCounts } from '../../models/product-counts';

@Component({
  selector: 'app-product-count-tiles',
  templateUrl: './product-count-tiles.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCountTiles {
  readonly counts = input.required<ProductCounts>();

  /** Total first, so RTL lays the tiles out right to left as the frame does. */
  protected readonly tiles = computed(() => [
    { label: 'إجمالي المنتجات / الخدمات', count: this.counts().total },
    { label: 'عناصر متاحة للزبائن (النشطة)', count: this.counts().available },
    { label: 'عناصر غير متاحة حالياً', count: this.counts().unavailable },
  ]);
}
