import { CAMPAIGN_STATUS_LABEL } from '../../../shared/models/campaign-status';
import { CsvRow, buildCsvFile } from '../../../shared/files/csv-file';
import { Ad } from '../models/ad';
import { AD_CONTENT_TYPE_LABEL } from '../models/ad-content-type';
import { AD_PLACEMENT_LABEL } from '../models/ad-placement';
import { formatAdPlace } from '../state/ad-place-label';

const HEADER: CsvRow = [
  'الإعلان',
  'المكان',
  'نوع المحتوى',
  'مكان الظهور',
  'تاريخ البدء',
  'تاريخ الانتهاء',
  'الأولوية',
  'الحالة',
];
const NO_END_DAY_CELL = '';

function toRow(ad: Ad): CsvRow {
  return [
    ad.title,
    formatAdPlace(ad),
    AD_CONTENT_TYPE_LABEL[ad.contentType],
    AD_PLACEMENT_LABEL[ad.placement],
    ad.startsOn,
    ad.endsOn ?? NO_END_DAY_CELL,
    String(ad.priority),
    CAMPAIGN_STATUS_LABEL[ad.status],
  ];
}

/** The export file has the same columns as the ads table, with the period split in two. */
export function buildAdsCsvFile(ads: readonly Ad[]): Blob {
  return buildCsvFile([HEADER, ...ads.map(toRow)]);
}
