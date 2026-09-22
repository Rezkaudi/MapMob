export interface MediaFile {
  readonly id: string;
  readonly name: string;
  readonly sizeInBytes: number;
  /** `null` for a file already on the server; kept so a picked file can be uploaded. */
  readonly file: File | null;
  /** Object URL for a picked file, or the saved url for one already on the server. */
  readonly previewUrl: string;
  /** Still frame a saved video shows before it plays. */
  readonly posterUrl?: string;
}
