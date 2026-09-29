import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { ArabicDatePipe } from '../../../../shared/pipes/arabic-date.pipe';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';
import { ErrorState } from '../../../../shared/ui/error-state/error-state';
import { FormDialogFrame } from '../../../../shared/ui/form-dialog-frame/form-dialog-frame';
import { SelectOption } from '../../../../shared/ui/select-field/select-option';
import { TableEmpty } from '../../../../shared/ui/table-empty/table-empty';
import { TableSkeleton } from '../../../../shared/ui/table-skeleton/table-skeleton';
import { DeliveryPlatformEntry } from '../../models/delivery-platform-entry';
import { LinkedStoreRow } from '../../state/linked-store-rows';
import { BrandLogo } from '../brand-logo/brand-logo';

/** Shares of the 982px frame table (211 / 144 / 256 / 220 / 151px). */
const COLUMN_WIDTHS = ['21.49%', '14.66%', '26.07%', '22.4%', '15.38%'];
const SKELETON_ROW_COUNT = 4;

@Component({
  selector: 'app-linked-stores-dialog',
  imports: [
    ArabicDatePipe,
    AppIcon,
    BrandLogo,
    ErrorState,
    FormDialogFrame,
    TableEmpty,
    TableSkeleton,
  ],
  templateUrl: './linked-stores-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinkedStoresDialog {
  readonly platform = input.required<DeliveryPlatformEntry>();
  readonly rows = input.required<readonly LinkedStoreRow[]>();
  readonly categoryOptions = input.required<readonly SelectOption[]>();
  readonly isLoading = input<boolean>(false);
  readonly error = input<string | null>(null);
  readonly emptyMessage = input<string>('');
  readonly searchChange = output<string>();
  readonly categoryChange = output<string | null>();
  readonly retry = output<void>();
  readonly closed = output<void>();

  protected readonly columnWidths = COLUMN_WIDTHS;
  protected readonly columnCount = COLUMN_WIDTHS.length;
  protected readonly skeletonRowCount = SKELETON_ROW_COUNT;
  protected readonly heading = computed(() => `المتاجر المرتبطة بمنصة ${this.platform().name}`);
  protected readonly linkHeader = computed(() => `رابط المتجر في ${this.platform().name}`);
  protected readonly isEmpty = computed(() => !this.isLoading() && this.rows().length === 0);

  protected onSearchInput(event: Event): void {
    this.searchChange.emit((event.target as HTMLInputElement).value);
  }

  protected onCategoryChange(event: Event): void {
    const picked = (event.target as HTMLSelectElement).value;
    this.categoryChange.emit(picked === '' ? null : picked);
  }
}
