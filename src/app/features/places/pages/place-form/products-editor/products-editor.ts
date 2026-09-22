import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { AppIcon } from '../../../../../shared/ui/app-icon/app-icon';
import { FormSection } from '../../../../../shared/ui/form-section/form-section';
import { PackageQuotaBadge } from '../../../../../shared/ui/package-quota-badge/package-quota-badge';
import { PlaceProduct } from '../../../models/place-product';

@Component({
  selector: 'app-products-editor',
  imports: [AppIcon, DecimalPipe, FormSection, PackageQuotaBadge],
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
}
