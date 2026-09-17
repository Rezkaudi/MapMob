import { ContentPageKind } from '../models/content-page-kind';

/** The fixed page name each editor heading shows, whatever title the admin types. */
export const CONTENT_PAGE_NAMES: Readonly<Record<ContentPageKind, string>> = {
  about: 'عن التطبيق',
  terms: 'الشروط والأحكام',
  privacy: 'سياسة الخصوصية',
  contact: 'تواصل معنا',
  faq: 'الأسئلة الشائعة',
};

/** The frames spell it "المحتةى"; the typo is fixed here. */
export const CONTENT_EDITOR_DESCRIPTION = 'تعديل المحتوى الذي يظهر للمستخدمين داخل تطبيق MapMob.';
export const CONTENT_SECTION_LABEL = 'إدارة المحتوى';
export const CONTENT_EDIT_STEP_LABEL = 'تعديل صفحة';
