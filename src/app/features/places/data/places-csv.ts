import { CsvRow, buildCsvFile } from '../../../shared/files/csv-file';
import { Place } from '../models/place';
import { PLACE_PACKAGE_LABEL } from '../models/place-package';
import { PLACE_STATUS_LABEL } from '../models/place-status';

const HEADER: CsvRow = [
  'اسم المكان',
  'الرقم',
  'التصنيف',
  'الموقع',
  'الحالة',
  'التقييم',
  'الباقة',
  'تاريخ الانضمام',
];
const ISO_DAY_LENGTH = 10;
const RATING_DECIMALS = 1;

function toRow(place: Place): CsvRow {
  return [
    place.name,
    place.code,
    place.category,
    place.city,
    PLACE_STATUS_LABEL[place.status],
    place.rating.toFixed(RATING_DECIMALS),
    PLACE_PACKAGE_LABEL[place.package],
    place.joinedAt.slice(0, ISO_DAY_LENGTH),
  ];
}

/** The export file has the same columns as the places table. */
export function buildPlacesCsvFile(places: readonly Place[]): Blob {
  return buildCsvFile([HEADER, ...places.map(toRow)]);
}
