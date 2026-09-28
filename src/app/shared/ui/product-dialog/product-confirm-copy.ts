import { ConfirmActionCopy } from '../confirm-action-dialog/confirm-action-copy';

export function buildRemoveProductCopy(productName: string): ConfirmActionCopy {
  return {
    title: 'حذف المنتج أو الخدمة',
    question: `هل أنت متأكد من حذف ${productName}؟`,
    detail: 'سيختفي المنتج من صفحة المكان، ولا يمكن التراجع عن ذلك.',
    confirmLabel: 'حذف',
    tone: 'danger',
  };
}
