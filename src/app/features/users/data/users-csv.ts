import { CsvRow, buildCsvFile } from '../../../shared/files/csv-file';
import { USER_ACCOUNT_TYPE_LABEL } from '../models/user-account-type';
import { USER_STATUS_LABEL } from '../models/user-status-label';
import { AppUser } from '../models/user';

const HEADER: CsvRow = [
  'اسم المستخدم',
  'البريد/الهاتف',
  'نوع الحساب',
  'تاريخ التسجيل',
  'آخر نشاط',
  'الحالة',
];
const ISO_DAY_LENGTH = 10;

function toRow(user: AppUser): CsvRow {
  return [
    user.name,
    user.email ?? user.phone ?? '',
    USER_ACCOUNT_TYPE_LABEL[user.accountType],
    user.registeredAt.slice(0, ISO_DAY_LENGTH),
    user.lastActiveAt.slice(0, ISO_DAY_LENGTH),
    USER_STATUS_LABEL[user.status],
  ];
}

/** The export file has the same columns as the users table. */
export function buildUsersCsvFile(users: readonly AppUser[]): Blob {
  return buildCsvFile([HEADER, ...users.map(toRow)]);
}
