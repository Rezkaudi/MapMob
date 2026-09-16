import { ConfirmActionCopy } from '../../../shared/ui/confirm-action-dialog/confirm-action-copy';
import { PackagePlan } from '../models/package-plan';

export function buildPlanDeleteCopy(plan: PackagePlan): ConfirmActionCopy {
  return {
    title: 'حذف الباقة',
    question: `هل أنت متأكد من حذف باقة "${plan.name}"؟`,
    detail: 'تبقى الاشتراكات السارية على بنودها حتى نهاية دورة الفوترة، ولا يمكن التراجع عن الحذف.',
    confirmLabel: 'حذف الباقة',
    tone: 'danger',
  };
}

export function buildPlanStatusCopy(plan: PackagePlan): ConfirmActionCopy {
  if (plan.isActive) {
    return {
      title: 'إيقاف الباقة مؤقتاً',
      question: `هل أنت متأكد من إيقاف باقة "${plan.name}" مؤقتاً؟`,
      detail: 'تختفي الباقة من صفحة الاشتراك، وتستمر الاشتراكات الحالية حتى انتهاء مدتها.',
      confirmLabel: 'إيقاف الباقة',
      tone: 'danger',
    };
  }
  return {
    title: 'تفعيل الباقة',
    question: `هل أنت متأكد من تفعيل باقة "${plan.name}"؟`,
    detail: 'تعود الباقة للظهور في صفحة الاشتراك ويمكن للمتاجر الاشتراك بها من جديد.',
    confirmLabel: 'تفعيل الباقة',
    tone: 'success',
  };
}
