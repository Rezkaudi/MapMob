import { ConfirmAction } from '../../../shared/models/confirm-action';
import { ConfirmActionCopy } from '../../../shared/ui/confirm-action-dialog/confirm-action-copy';
import { AppUser } from '../models/user';

export function buildUserConfirmCopy(action: ConfirmAction, user: AppUser): ConfirmActionCopy {
  const { name } = user;
  if (action === 'activate') {
    return {
      title: 'تفعيل الحساب',
      question: `هل تريد تفعيل حساب ${name}؟`,
      detail: 'سيتمكن المستخدم من استخدام التطبيق من جديد.',
      confirmLabel: 'تفعيل الحساب',
      tone: 'success',
    };
  }
  if (action === 'suspend') {
    return {
      title: 'إيقاف الحساب',
      question: `هل أنت متأكد من إيقاف حساب ${name}؟`,
      detail: 'لن يتمكن المستخدم من استخدام التطبيق حتى تتم إعادة تفعيله.',
      confirmLabel: 'إيقاف الحساب',
      tone: 'danger',
    };
  }
  return {
    title: 'حذف المستخدم',
    question: `هل أنت متأكد من حذف حساب ${name}؟`,
    detail: 'سيتم حذف بيانات المستخدم نهائياً، ولا يمكن التراجع عن ذلك.',
    confirmLabel: 'حذف المستخدم',
    tone: 'danger',
  };
}
