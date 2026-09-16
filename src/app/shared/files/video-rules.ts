import { FileRules } from '../ui/media-picker/file-rules';

const MEGABYTE = 1024 * 1024;
const MAX_VIDEO_MEGABYTES = 50;

/** Shared by every form that takes a video. */
export const VIDEO_RULES: FileRules = {
  maxBytes: MAX_VIDEO_MEGABYTES * MEGABYTE,
  accepted: ['video/*'],
  typeMessage: 'يُسمح بملفات الفيديو فقط',
  sizeMessage: 'الحد الأقصى لحجم الفيديو 50 ميجابايت',
};
