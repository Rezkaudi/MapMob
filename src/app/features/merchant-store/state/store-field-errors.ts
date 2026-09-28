import { StoreProfileFormGroup } from './store-profile-form-group';

export type StoreTextField =
  | 'name'
  | 'description'
  | 'phone'
  | 'email'
  | 'whatsapp'
  | 'facebook'
  | 'instagram'
  | 'telegram'
  | 'address';

type ErrorMessages = Partial<Record<'required' | 'maxlength' | 'pattern', string>>;

const LINK_MESSAGE = 'أدخل رابطاً كاملاً يبدأ بـ https://';

/** Checked in this order, so an empty field is asked for before its shape is judged. */
const MESSAGES: Record<StoreTextField, ErrorMessages> = {
  name: { required: 'أدخل اسم المتجر', maxlength: 'الاسم 150 حرفاً كحد أقصى' },
  description: { required: 'أدخل وصف المتجر', maxlength: 'الوصف 300 حرف كحد أقصى' },
  phone: { required: 'أدخل رقم الهاتف الأساسي', pattern: 'أدخل رقم هاتف صحيح' },
  email: { pattern: 'أدخل بريداً إلكترونياً صحيحاً' },
  whatsapp: { pattern: 'أدخل رقم واتساب صحيح' },
  facebook: { pattern: LINK_MESSAGE },
  instagram: { pattern: LINK_MESSAGE },
  telegram: { pattern: LINK_MESSAGE },
  address: { required: 'أدخل العنوان التفصيلي', maxlength: 'العنوان 255 حرفاً كحد أقصى' },
};

/** The message under a field, shown only once the owner has been there or pressed save. */
export function findStoreFieldError(
  form: StoreProfileFormGroup,
  field: StoreTextField,
): string | null {
  const control = form.controls[field];
  if (!control.touched || control.valid) {
    return null;
  }
  const messages = MESSAGES[field];
  const failed = (Object.keys(messages) as (keyof ErrorMessages)[]).find((kind) =>
    control.hasError(kind),
  );
  return failed ? (messages[failed] ?? null) : null;
}

export type StoreFieldErrors = Readonly<Record<StoreTextField, string | null>>;

export function findStoreFieldErrors(form: StoreProfileFormGroup): StoreFieldErrors {
  const fields = Object.keys(MESSAGES) as StoreTextField[];
  return Object.fromEntries(
    fields.map((field) => [field, findStoreFieldError(form, field)]),
  ) as StoreFieldErrors;
}
