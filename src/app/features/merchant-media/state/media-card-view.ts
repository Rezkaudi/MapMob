import { formatLatinFileSize } from '../../../shared/formatting/file-size';
import { formatLatinDigitDate } from '../../../shared/formatting/latin-digit-date';
import { MediaCardView } from '../models/media-card-view';
import { MediaKind } from '../models/media-kind';
import { MerchantMediaItem } from '../models/merchant-media-item';
import { mediaFormatLabel } from './media-file-format';
import { acceptedTypesOf } from './media-upload-rules';

const KIND_COPY: Record<MediaKind, { readonly label: string; readonly replaceLabel: string }> = {
  image: { label: 'صورة', replaceLabel: 'استبدال الصورة' },
  video: { label: 'فيديو', replaceLabel: 'استبدال الفيديو' },
};

export function toMediaCard(item: MerchantMediaItem): MediaCardView {
  const copy = KIND_COPY[item.kind];
  return {
    item,
    kindLabel: copy.label,
    isVideo: item.kind === 'video',
    fileText: describeFile(item),
    addedText: `أضيف في ${formatLatinDigitDate(item.createdAt)}`,
    replaceLabel: copy.replaceLabel,
    accept: acceptedTypesOf(item.kind),
  };
}

// The live server sends no file size, so the card shows only the format then.
function describeFile(item: MerchantMediaItem): string {
  const format = mediaFormatLabel(item.mimeType);
  return item.sizeBytes > 0 ? `${format} · ${formatLatinFileSize(item.sizeBytes)}` : format;
}
