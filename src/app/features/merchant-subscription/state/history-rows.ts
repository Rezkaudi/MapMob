import { SPACED_SLASH, formatSlashDate } from '../../../shared/formatting/slash-date';
import { formatMoney } from '../../../shared/money/format-money';
import { SubscriptionHistoryRow } from '../models/subscription-history-row';
import { SubscriptionRecord } from '../models/subscription-record';
import { SUBSCRIPTION_STATUS_COPY } from './subscription-status-copy';
import { TERM_LABEL } from './term-words';

function toHistoryRow(record: SubscriptionRecord): SubscriptionHistoryRow {
  return {
    record,
    planName: record.plan.name,
    termLabel: TERM_LABEL[record.term],
    amountText: formatMoney(record.price.amount, record.price.currency),
    startsOnText: formatSlashDate(record.startsOn, SPACED_SLASH),
    endsOnText: formatSlashDate(record.endsOn, SPACED_SLASH),
    status: SUBSCRIPTION_STATUS_COPY[record.status],
  };
}

export function buildHistoryRows(
  history: readonly SubscriptionRecord[],
): readonly SubscriptionHistoryRow[] {
  return history.map(toHistoryRow);
}
