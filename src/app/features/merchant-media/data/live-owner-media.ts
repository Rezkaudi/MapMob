/** A row of GET /owner/media. The server sends no file type, size or main flag. */
export interface LiveOwnerMedia {
  readonly id: string;
  readonly type: string;
  readonly url: string;
  readonly createdAt: string;
}
