import { ConfirmActionCopy } from '../../../shared/ui/confirm-action-dialog/confirm-action-copy';
import { MediaKind } from '../models/media-kind';
import { MerchantMediaItem } from '../models/merchant-media-item';

const KIND_COPY: Record<MediaKind, { readonly title: string; readonly question: string }> = {
  image: { title: 'حذف الصورة', question: 'هل أنت متأكد من حذف هذه الصورة؟' },
  video: { title: 'حذف الفيديو', question: 'هل أنت متأكد من حذف هذا الفيديو؟' },
};

const PLAIN_DETAIL = 'ستختفي من صفحة مكانك، ولا يمكن التراجع عن ذلك.';
const MAIN_DETAIL = 'هذه الصورة الرئيسية لمكانك وستختفي من بطاقة المكان، ولا يمكن التراجع عن ذلك.';

export function buildRemoveMediaCopy(item: MerchantMediaItem): ConfirmActionCopy {
  return {
    ...KIND_COPY[item.kind],
    detail: item.isMain ? MAIN_DETAIL : PLAIN_DETAIL,
    confirmLabel: 'حذف',
    tone: 'danger',
  };
}
