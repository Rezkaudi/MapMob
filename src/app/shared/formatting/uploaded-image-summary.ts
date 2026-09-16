import { UploadedImage } from '../ui/image-upload-field/uploaded-image';
import { formatFileSize } from './file-size';

const PART_SEPARATOR = ' — ';

type ImageFacts = Pick<UploadedImage, 'sizeInBytes' | 'width' | 'height'>;

/** "الحجم: 1.4 ميجابايت — الأبعاد: 1200 × 630 بكسل", leaving out what is not known. */
export function describeUploadedImage({ sizeInBytes, width, height }: ImageFacts): string {
  const parts: string[] = [];
  if (sizeInBytes !== null) {
    parts.push(`الحجم: ${formatFileSize(sizeInBytes)}`);
  }
  if (width !== null && height !== null) {
    parts.push(`الأبعاد: ${width} × ${height} بكسل`);
  }
  return parts.join(PART_SEPARATOR);
}
