import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { AppIcon } from '../../../../../shared/ui/app-icon/app-icon';
import { FormSection } from '../../../../../shared/ui/form-section/form-section';
import { PlaceProduct } from '../../../models/place-product';

const FULL_BAR_PERCENT = 100;

@Component({
  selector: 'app-products-editor',
  imports: [AppIcon, FormSection, DecimalPipe],
  templateUrl: './products-editor.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsEditor {
  readonly products = input.required<readonly PlaceProduct[]>();
  /** How many products the current package allows. */
  readonly limit = input.required<number>();
  readonly packageLabel = input.required<string>();

  readonly addProduct = output<void>();
  readonly editProduct = output<PlaceProduct>();
  readonly removeProduct = output<PlaceProduct>();

  protected readonly isFull = computed(() => this.products().length >= this.limit());
  protected readonly quotaLabel = computed(
    () => `${this.products().length} / ${this.limit()} منتجات وخدمات`,
  );
  protected readonly fillWidth = computed(() => {
    const share = (this.products().length / this.limit()) * FULL_BAR_PERCENT;
    return `${Math.min(share, FULL_BAR_PERCENT)}%`;
  });
}
