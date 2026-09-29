const FORMAT_LABELS: Record<string, string> = {
  'image/jpeg': 'JPG',
  'image/png': 'PNG',
  'video/mp4': 'MP4',
  'video/quicktime': 'MOV',
};

/** "image/jpeg" → "JPG", as the cards name a file's format. */
export function mediaFormatLabel(mimeType: string): string {
  return FORMAT_LABELS[mimeType] ?? mimeType.split('/').pop()!.toUpperCase();
}
