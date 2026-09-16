import { FileRules } from '../ui/media-picker/file-rules';

const MEGABYTE = 1024 * 1024;
const MAX_PICTURE_MEGABYTES = 5;

/** "الحد الأقصى لحجم الصورة 5 ميجابايت (JPG, PNG)", shared by every form that takes a picture. */
export const PICTURE_RULES: FileRules = {
  maxBytes: MAX_PICTURE_MEGABYTES * MEGABYTE,
  accepted: ['image/jpeg', 'image/png'],
  typeMessage: 'يُسمح بصيغ JPG و PNG فقط',
  sizeMessage: 'الحد الأقصى لحجم الصورة 5 ميجابايت',
};
