import { CsvRow, buildCsvFile } from '../../../shared/files/csv-file';
import { Complaint } from '../models/complaint';
import { COMPLAINT_REASON_LABELS } from '../models/complaint-reason';
import { COMPLAINT_STATUS_LABELS } from '../models/complaint-status';

const HEADER: CsvRow = [
  'رقم البلاغ',
  'المبلغ',
  'البريد الإلكتروني',
  'البلاغ على',
  'نوع البلاغ',
  'التاريخ',
  'الحالة',
];

function toRow(complaint: Complaint): CsvRow {
  return [
    complaint.reference,
    complaint.reporter.name,
    complaint.reporter.email,
    complaint.place.name,
    COMPLAINT_REASON_LABELS[complaint.reason],
    complaint.reportedOn,
    COMPLAINT_STATUS_LABELS[complaint.status],
  ];
}

/** The same columns as the complaints table, with the reporter's email in its own column. */
export function toComplaintCsvRows(complaints: readonly Complaint[]): readonly CsvRow[] {
  return [HEADER, ...complaints.map(toRow)];
}

export function buildComplaintsCsvFile(complaints: readonly Complaint[]): Blob {
  return buildCsvFile(toComplaintCsvRows(complaints));
}
