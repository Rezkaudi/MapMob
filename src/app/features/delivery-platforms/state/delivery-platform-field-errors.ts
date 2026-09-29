import { DeliveryPlatformFormGroup } from './delivery-platform-form-group';

export type DeliveryPlatformTextField = 'name' | 'latinName' | 'websiteUrl' | 'sortOrder';

type ErrorMessages = Partial<Record<'required' | 'maxlength' | 'pattern', string>>;

/** Checked in this order, so an empty field is asked for before its shape is judged. */
const MESSAGES: Record<DeliveryPlatformTextField, ErrorMessages> = {
  name: { required: 'أدخل اسم المنصة بالعربي', maxlength: 'الاسم 60 حرفاً كحد أقصى' },
  latinName: {
    required: 'أدخل اسم المنصة بالانجليزية',
    maxlength: 'الاسم 60 حرفاً كحد أقصى',
    pattern: 'اكتب الاسم بأحرف لاتينية',
  },
  websiteUrl: {
    required: 'أدخل رابط المنصة الرئيسي',
    maxlength: 'الرابط 255 حرفاً كحد أقصى',
    pattern: 'أدخل رابطاً كاملاً يبدأ بـ https://',
  },
  sortOrder: { pattern: 'أدخل رقماً صحيحاً من 1 فأكثر' },
};

export type DeliveryPlatformFieldErrors = Readonly<
  Record<DeliveryPlatformTextField, string | null>
>;

/** The message under each field, shown only once the admin has been there or pressed save. */
export function findDeliveryPlatformFieldErrors(
  form: DeliveryPlatformFormGroup,
): DeliveryPlatformFieldErrors {
  const findError = (field: DeliveryPlatformTextField): string | null => {
    const control = form.controls[field];
    if (!control.touched || control.valid) {
      return null;
    }
    const messages = MESSAGES[field];
    const failed = (Object.keys(messages) as (keyof ErrorMessages)[]).find((kind) =>
      control.hasError(kind),
    );
    return failed ? (messages[failed] ?? null) : null;
  };
  return {
    name: findError('name'),
    latinName: findError('latinName'),
    websiteUrl: findError('websiteUrl'),
    sortOrder: findError('sortOrder'),
  };
}
