export interface MediaFile {
  readonly id: string;
  readonly name: string;
  readonly sizeInBytes: number;
  /** Kept so the file can be uploaded once the API exists. */
  readonly file: File;
  /** Object URL used for the on-screen preview. */
  readonly previewUrl: string;
}
