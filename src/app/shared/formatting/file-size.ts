const BYTES_PER_KILOBYTE = 1024;
const BYTES_PER_MEGABYTE = BYTES_PER_KILOBYTE * BYTES_PER_KILOBYTE;
const DECIMALS = 1;

/** "1.4 ميجابايت", as the uploaded-image card writes a size. */
export function formatFileSize(sizeInBytes: number): string {
  if (sizeInBytes < BYTES_PER_MEGABYTE) {
    return `${(sizeInBytes / BYTES_PER_KILOBYTE).toFixed(DECIMALS)} كيلوبايت`;
  }
  return `${(sizeInBytes / BYTES_PER_MEGABYTE).toFixed(DECIMALS)} ميجابايت`;
}

/** "2.4 MB", as the media cards write a size beside its format. */
export function formatLatinFileSize(sizeInBytes: number): string {
  if (sizeInBytes < BYTES_PER_MEGABYTE) {
    return `${(sizeInBytes / BYTES_PER_KILOBYTE).toFixed(DECIMALS)} KB`;
  }
  return `${(sizeInBytes / BYTES_PER_MEGABYTE).toFixed(DECIMALS)} MB`;
}
