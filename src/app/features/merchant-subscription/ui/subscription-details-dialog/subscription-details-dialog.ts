import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { DialogFrame } from '../../../../shared/ui/dialog-frame/dialog-frame';
import { SubscriptionDetailsView } from '../../models/subscription-details-view';
import { PlanFeatureList } from '../plan-feature-list/plan-feature-list';
import { SubscriptionStatusBadge } from '../subscription-status-badge/subscription-status-badge';

interface DetailsFact {
  readonly label: string;
  readonly value: string;
  readonly isLatin: boolean;
}

/** "تفاصيل الاشتراك": the period's facts in grey tiles, then the plan's features. */
@Component({
  selector: 'app-subscription-details-dialog',
  imports: [DialogFrame, PlanFeatureList, SubscriptionStatusBadge],
  templateUrl: './subscription-details-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubscriptionDetailsDialog {
  readonly details = input.required<SubscriptionDetailsView>();
  readonly closed = output<void>();

  /** In grid order: RTL fills each row from the right. */
  protected readonly facts = computed<readonly DetailsFact[]>(() => {
    const details = this.details();
    return [
      { label: 'تاريخ بداية الاشتراك', value: details.startsOnText, isLatin: true },
      { label: 'تاريخ نهاية الاشتراك', value: details.endsOnText, isLatin: true },
      { label: 'المبلغ المدفوع', value: details.amountText, isLatin: false },
      { label: 'المدة', value: details.termLabel, isLatin: false },
      { label: 'طريقة الدفع', value: details.paymentMethodText, isLatin: false },
    ];
  });
}
