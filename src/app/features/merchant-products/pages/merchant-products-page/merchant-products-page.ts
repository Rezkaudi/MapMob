import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AddButton } from '../../../../shared/ui/add-button/add-button';
import { ConfirmActionDialog } from '../../../../shared/ui/confirm-action-dialog/confirm-action-dialog';
import { ErrorState } from '../../../../shared/ui/error-state/error-state';
import { PageHeader } from '../../../../shared/ui/page-header/page-header';
import { ProductDialog } from '../../../../shared/ui/product-dialog/product-dialog';
import { Toast } from '../../../../shared/ui/toast/toast';
import { MerchantProductsStore } from '../../state/merchant-products.store';
import { ProductCountTiles } from '../../ui/product-count-tiles/product-count-tiles';
import { ProductTable } from '../../ui/product-table/product-table';
import { ProductToolbar } from '../../ui/product-toolbar/product-toolbar';
import { ProductUsageCard } from '../../ui/product-usage-card/product-usage-card';

@Component({
  selector: 'app-merchant-products-page',
  imports: [
    AddButton,
    ConfirmActionDialog,
    ErrorState,
    PageHeader,
    ProductCountTiles,
    ProductDialog,
    ProductTable,
    ProductToolbar,
    ProductUsageCard,
    Toast,
  ],
  providers: [MerchantProductsStore],
  templateUrl: './merchant-products-page.html',
  host: { class: 'flex min-h-full flex-col' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MerchantProductsPage {
  protected readonly store = inject(MerchantProductsStore);

  constructor() {
    this.store.load();
  }
}
