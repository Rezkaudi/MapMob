import { CsvRow, buildCsvFile } from '../../../shared/files/csv-file';
import { SUBSCRIPTION_STATUS_LABEL } from '../models/subscription-status-label';
import { Subscription } from '../models/subscription';

const HEADER: CsvRow = [
  'اسم الشركة /المتجر',
  'الباقة',
  'السعر',
  'تاريخ البدء',
  'تاريخ الانتهاء',
  'الحالة',
];

function toRow(entry: Subscription): CsvRow {
  return [
    entry.companyName,
    entry.planName,
    `${entry.price}${entry.currencySymbol}`,
    entry.startedOn,
    entry.endsOn,
    SUBSCRIPTION_STATUS_LABEL[entry.status],
  ];
}

/** The export file has the same columns as the subscriptions table. */
export function buildSubscriptionsCsvFile(entries: readonly Subscription[]): Blob {
  return buildCsvFile([HEADER, ...entries.map(toRow)]);
}
