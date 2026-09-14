import { RegionConfirmAction } from '../models/region-confirm-action';
import { RegionFormMode } from '../models/region-form-mode';
import { RegionKind } from '../models/region-kind';
import { RegionConfirmCopy } from './region-confirm-copy';
import { RegionFormCopy } from './region-form-copy';

interface RegionNouns {
  /** "محافظة" — used before a name, as in "محافظة طرطوس". */
  readonly singular: string;
  /** "المحافظة" — used on its own. */
  readonly definite: string;
  readonly deleteDetail: string;
}

const NOUNS: Record<RegionKind, RegionNouns> = {
  governorate: {
    singular: 'محافظة',
    definite: 'المحافظة',
    deleteDetail: 'سيتم حذف جميع المناطق التابعة لها، ولا يمكن التراجع عن ذلك.',
  },
  area: {
    singular: 'منطقة',
    definite: 'المنطقة',
    deleteDetail: 'لا يمكن التراجع عن هذا الإجراء.',
  },
};

const SAVE_CHANGES_LABEL = 'حفظ التغييرات';

export function buildFormCopy(kind: RegionKind, mode: RegionFormMode): RegionFormCopy {
  const { singular, definite } = NOUNS[kind];
  const nameLabel = `اسم ${definite}`;
  if (mode === 'edit') {
    return {
      title: `تعديل ${definite}`,
      description: `تعديل بيانات ${definite} وإدارة حالتها`,
      nameLabel,
      submitLabel: SAVE_CHANGES_LABEL,
    };
  }
  return {
    title: `إضافة ${singular}`,
    description: `إضافة ${singular} جديدة للنظام.`,
    nameLabel,
    submitLabel: `إضافة ${definite}`,
  };
}

export function buildConfirmCopy(
  kind: RegionKind,
  action: RegionConfirmAction,
  name: string,
): RegionConfirmCopy {
  const { singular, definite, deleteDetail } = NOUNS[kind];
  if (action === 'activate') {
    return {
      title: `تفعيل ${definite}`,
      question: `هل تريد تفعيل ${singular} ${name}؟`,
      detail: 'ستصبح متاحة للاستخدام عند إضافة أماكن جديدة.',
      confirmLabel: `تفعيل ${definite}`,
      tone: 'success',
    };
  }
  if (action === 'suspend') {
    return {
      title: `تعطيل ${definite}`,
      question: `هل أنت متأكد من تعطيل ${singular} ${name}؟`,
      detail: `لن تظهر هذه ${definite} كخيار عند إضافة أماكن جديدة.`,
      confirmLabel: `تعطيل ${definite}`,
      tone: 'danger',
    };
  }
  return {
    title: `حذف ${definite}`,
    question: `هل أنت متأكد من حذف ${singular} ${name}؟`,
    detail: deleteDetail,
    confirmLabel: `حذف ${definite}`,
    tone: 'danger',
  };
}
