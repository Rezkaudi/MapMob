import { CsvRow, buildCsvFile } from '../../../shared/files/csv-file';
import { Offer } from '../models/offer';
import { CAMPAIGN_STATUS_LABEL } from '../../../shared/models/campaign-status';

const HEADER: CsvRow = ['العرض', 'المكان', 'التصنيف', 'تاريخ البدء', 'تاريخ الانتهاء', 'الحالة'];

function toRow(offer: Offer): CsvRow {
  return [
    offer.title,
    offer.placeName,
    offer.categoryName,
    offer.startsOn,
    offer.endsOn,
    CAMPAIGN_STATUS_LABEL[offer.status],
  ];
}

/** The export file has the same columns as the offers table. */
export function buildOffersCsvFile(offers: readonly Offer[]): Blob {
  return buildCsvFile([HEADER, ...offers.map(toRow)]);
}
