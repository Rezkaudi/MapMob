import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AddButton } from '../../../../shared/ui/add-button/add-button';
import { CountTiles } from '../../../../shared/ui/count-tiles/count-tiles';
import { ConfirmActionDialog } from '../../../../shared/ui/confirm-action-dialog/confirm-action-dialog';
import { ErrorState } from '../../../../shared/ui/error-state/error-state';
import { PageHeader } from '../../../../shared/ui/page-header/page-header';
import { PlanUsageCard } from '../../../../shared/ui/plan-usage-card/plan-usage-card';
import { ProductDialog } from '../../../../shared/ui/product-dialog/product-dialog';
import { Toast } from '../../../../shared/ui/toast/toast';
import { MerchantProductsStore } from '../../state/merchant-products.store';
import { ProductTable } from '../../ui/product-table/product-table';
import { ProductToolbar } from '../../ui/product-toolbar/product-toolbar';

@Component({
  selector: 'app-merchant-products-page',
  imports: [
    AddButton,
    ConfirmActionDialog,
    CountTiles,
    ErrorState,
    PageHeader,
    PlanUsageCard,
    ProductDialog,
    ProductTable,
    ProductToolbar,
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
