import { PlatformSettingsForm } from '../../models/platform-settings';

export const PLATFORM_SAVED_TITLE = 'تم حفظ التغييرات';
export const PLATFORM_FAILED_TITLE = 'تعذر حفظ التغييرات';

export const PLATFORM_SAVED_MESSAGES: Record<PlatformSettingsForm, string> = {
  general: 'تم تحديث معلومات المنصة الأساسية.',
  map: 'تم تحديث إعدادات الخرائط والموقع الجغرافي.',
  language: 'تم تحديث إعدادات اللغة.',
  currency: 'تم تحديث إعدادات العملة والأسعار.',
};
