import { buildCsvText } from '../../../shared/files/csv-file';
import { buildComplaintDetail } from '../testing/complaint-fixture';
import { toComplaintCsvRows } from './complaints-csv';

describe('toComplaintCsvRows', () => {
  it('writes the table columns, then one line per complaint', () => {
    const rows = toComplaintCsvRows([buildComplaintDetail()]);

    expect(buildCsvText(rows)).toBe(
      [
        'رقم البلاغ,المبلغ,البريد الإلكتروني,البلاغ على,نوع البلاغ,التاريخ,الحالة',
        '#1023,سارة علي,sara.r@example.com,مطعم الشام,معلومات خاطئة,2026-09-09,جديد',
      ].join('\r\n'),
    );
  });
});
