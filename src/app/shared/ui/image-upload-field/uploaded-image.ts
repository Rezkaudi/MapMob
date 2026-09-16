/** A picture picked in a form, or the one already saved when the form edits. */
export interface UploadedImage {
  /** `null` for a picture that is already on the server. */
  readonly file: File | null;
  readonly name: string;
  readonly previewUrl: string;
  readonly sizeInBytes: number | null;
  readonly width: number | null;
  readonly height: number | null;
}
