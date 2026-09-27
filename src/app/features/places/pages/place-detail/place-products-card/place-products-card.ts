import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { AppIcon } from '../../../../../shared/ui/app-icon/app-icon';
import { ActionMenu } from '../../../../../shared/ui/action-menu/action-menu';
import { Badge } from '../../../../../shared/ui/badge/badge';
import { SectionPanel } from '../../../../../shared/ui/section-panel/section-panel';
import { PlaceProduct } from '../../../models/place-product';
import { CurrencySymbolPipe } from '../../../../../shared/pipes/currency-symbol.pipe';
import { PRODUCT_AVAILABILITY_LABELS } from '../../../models/product-availability';

@Component({
  selector: 'app-place-products-card',
  imports: [AppIcon, ActionMenu, Badge, SectionPanel, DecimalPipe, CurrencySymbolPipe],
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
}
