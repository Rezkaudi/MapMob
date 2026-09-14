import { USER_ACCOUNT_TYPE_LABEL } from '../models/user-account-type';
import { USER_STATUS_LABEL } from '../models/user-status-label';
import { AppUser } from '../models/user';

const HEADER = [
  'اسم المستخدم',
  'البريد/الهاتف',
  'نوع الحساب',
  'تاريخ التسجيل',
  'آخر نشاط',
  'الحالة',
];
const LINE_BREAK = '\r\n';
const ISO_DAY_LENGTH = 10;
const NEEDS_QUOTES = /[",\r\n]/;

function escapeCell(value: string): string {
  return NEEDS_QUOTES.test(value) ? `"${value.replaceAll('"', '""')}"` : value;
}

function toRow(user: AppUser): readonly string[] {
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
export function buildUsersCsv(users: readonly AppUser[]): string {
  return [HEADER, ...users.map(toRow)].map((row) => row.map(escapeCell).join(',')).join(LINE_BREAK);
}
