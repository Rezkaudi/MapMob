import { MediaKind } from '../models/media-kind';

interface MediaUploadCopy {
  readonly fieldLabel: string;
  readonly prompt: string;
  readonly hint: string;
}

/** The frame writes the picture lines; the video ones follow them. */
export const MEDIA_UPLOAD_COPY: Record<MediaKind, MediaUploadCopy> = {
  image: {
    fieldLabel: 'رفع الصور',
    prompt: 'اسحب وأفلت الصور هنا',
    hint: 'الحد الأقصى لحجم الصورة 5 ميجابايت (JPG, PNG)',
  },
  video: {
    fieldLabel: 'رفع الفيديو',
    prompt: 'اسحب وأفلت الفيديو هنا',
    hint: 'الحد الأقصى لحجم الفيديو 50 ميجابايت',
  },
};
