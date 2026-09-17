import { CountWords, formatArabicCount } from '../../../shared/formatting/arabic-count';

const ADMIN_WORDS: CountWords = {
  one: 'مشرف واحد فقط',
  two: 'مشرفان',
  few: 'مشرفين',
  many: 'مشرفاً',
};

const PERMISSION_WORDS: CountWords = {
  one: 'صلاحية واحدة',
  two: 'صلاحيتان',
  few: 'صلاحيات',
  many: 'صلاحية',
};

export function describeAdminCount(count: number): string {
  return count === 0 ? 'بدون مشرفين' : formatArabicCount(count, ADMIN_WORDS);
}

export function describePermissionCount(count: number, isFullAccess: boolean): string {
  const words = formatArabicCount(count, PERMISSION_WORDS);
  return isFullAccess ? `${words} (كامل الصلاحيات)` : words;
}
