import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';
import { SubscriptionHistoryRow } from '../../models/subscription-history-row';
import { SubscriptionRecord } from '../../models/subscription-record';
import { SectionHeading } from '../section-heading/section-heading';
import { SubscriptionStatusPill } from '../subscription-status-pill/subscription-status-pill';

/** The "سجل الاشتراكات" card. */
@Component({
  selector: 'app-subscription-history-table',
  imports: [AppIcon, SectionHeading, SubscriptionStatusPill],
  templateUrl: './subscription-history-table.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubscriptionHistoryTable {
  readonly rows = input.required<readonly SubscriptionHistoryRow[]>();
  readonly view = output<SubscriptionRecord>();
}
