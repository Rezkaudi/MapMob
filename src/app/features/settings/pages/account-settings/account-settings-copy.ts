import { AccountForm } from '../../models/account-form';

interface ToastCopy {
  readonly title: string;
  readonly message: string;
}

export const ACCOUNT_SAVED_COPY: Record<AccountForm, ToastCopy> = {
  profile: { title: 'تم حفظ التغييرات', message: 'تم تحديث بيانات حسابك الشخصي.' },
  password: {
    title: 'تم تحديث كلمة المرور',
    message: 'استخدم كلمة المرور الجديدة عند تسجيل الدخول القادم.',
  },
};

export const ACCOUNT_FAILED_TITLES: Record<AccountForm, string> = {
  profile: 'تعذر حفظ التغييرات',
  password: 'تعذر تحديث كلمة المرور',
};

export const ACCOUNT_FIELD_MESSAGES = {
  fullName: 'اكتب الاسم الكامل',
  email: 'اكتب بريداً إلكترونياً صحيحاً',
  currentPassword: 'اكتب كلمة المرور الحالية',
  newPasswordRequired: 'اكتب كلمة المرور الجديدة',
  newPasswordTooShort: 'كلمة المرور 8 أحرف على الأقل',
  confirmRequired: 'أعد كتابة كلمة المرور الجديدة',
  confirmMismatch: 'كلمتا المرور غير متطابقتين',
};
