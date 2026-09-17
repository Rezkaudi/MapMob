import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LatinDigitDatePipe } from '../../../../shared/pipes/latin-digit-date.pipe';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';
import { TableEmpty } from '../../../../shared/ui/table-empty/table-empty';
import { TableSkeleton } from '../../../../shared/ui/table-skeleton/table-skeleton';
import { ContentPage } from '../../models/content-page';
import { ContentPageKind } from '../../models/content-page-kind';
import { contentPageEditUrl } from '../../state/content-page-route';
import { ContentStatusPill } from '../content-status-pill/content-status-pill';

/** Shares of the 1046px design table: 72 / 274 / 242 / 310 / 148px, right to left. */
const COLUMN_WIDTHS = ['6.88%', '26.2%', '23.14%', '29.63%', '14.15%'];
const PAGE_KIND_COUNT = 5;

@Component({
  selector: 'app-content-page-table',
  imports: [AppIcon, ContentStatusPill, LatinDigitDatePipe, RouterLink, TableEmpty, TableSkeleton],
  templateUrl: './content-page-table.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentPageTable {
  readonly pages = input.required<readonly ContentPage[]>();
  readonly selectedIdSet = input<ReadonlySet<string>>(new Set());
  readonly areAllSelected = input<boolean>(false);
  readonly isLoading = input<boolean>(false);
  readonly hasNoResults = input<boolean>(false);

  readonly rowToggle = output<ContentPageKind>();
  readonly allToggle = output<void>();

  protected readonly columnWidths = COLUMN_WIDTHS;
  protected readonly columnCount = COLUMN_WIDTHS.length;
  protected readonly rowCount = PAGE_KIND_COUNT;
  protected readonly editUrl = contentPageEditUrl;
}
