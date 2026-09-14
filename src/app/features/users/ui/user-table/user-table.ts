import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CLOCK } from '../../../../core/config/clock';
import { formatArabicRelativeTime } from '../../../../shared/formatting/arabic-relative-time';
import { ArabicDatePipe } from '../../../../shared/pipes/arabic-date.pipe';
import { RowActionsMenu } from '../../../../shared/ui/row-actions-menu/row-actions-menu';
import { StatusPill } from '../../../../shared/ui/status-pill/status-pill';
import { TableEmpty } from '../../../../shared/ui/table-empty/table-empty';
import { TableSkeleton } from '../../../../shared/ui/table-skeleton/table-skeleton';
import { AppUser } from '../../models/user';
import { USER_ACCOUNT_TYPE_LABEL } from '../../models/user-account-type';
import { USER_STATUS_LABEL } from '../../models/user-status-label';

/**
 * Column widths as shares of the 1046px design table (70 / 126 / 160 / 150 / 140 / 140 / 160 / 100px),
 * so wider screens spread the columns instead of piling the spare room into one.
 */
const COLUMN_WIDTHS = ['6.69%', '12.05%', '15.3%', '14.34%', '13.38%', '13.38%', '15.3%', '9.56%'];
const DEFAULT_ROW_COUNT = 6;
const MISSING_CONTACT_LABEL = '—';

interface UserTableRow {
  readonly user: AppUser;
  readonly contactLabel: string;
  readonly hasContact: boolean;
  readonly accountTypeLabel: string;
  readonly lastActiveLabel: string;
  readonly statusLabel: string;
}

@Component({
  selector: 'app-user-table',
  imports: [ArabicDatePipe, RouterLink, RowActionsMenu, StatusPill, TableEmpty, TableSkeleton],
  templateUrl: './user-table.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserTable {
  private readonly clock = inject(CLOCK);

  readonly entries = input.required<readonly AppUser[]>();
  readonly selectedIdSet = input<ReadonlySet<string>>(new Set());
  readonly areAllSelected = input<boolean>(false);
  readonly isLoading = input<boolean>(false);
  readonly hasNoResults = input<boolean>(false);
  readonly emptyMessage = input<string>('');
  readonly rowCount = input<number>(DEFAULT_ROW_COUNT);

  readonly rowToggle = output<string>();
  readonly allToggle = output<void>();
  readonly view = output<AppUser>();
  readonly statusChange = output<AppUser>();
  readonly remove = output<AppUser>();

  protected readonly columnWidths = COLUMN_WIDTHS;
  protected readonly columnCount = COLUMN_WIDTHS.length;
  protected readonly rows = computed<readonly UserTableRow[]>(() => {
    const now = this.clock();
    return this.entries().map((user) => ({
      user,
      contactLabel: user.email ?? user.phone ?? MISSING_CONTACT_LABEL,
      hasContact: !!(user.email ?? user.phone),
      accountTypeLabel: USER_ACCOUNT_TYPE_LABEL[user.accountType],
      lastActiveLabel: formatArabicRelativeTime(user.lastActiveAt, now),
      statusLabel: USER_STATUS_LABEL[user.status],
    }));
  });
}
