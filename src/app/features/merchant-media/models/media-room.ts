/** How much more the plan takes. Counts are null when there is no cap. */
export interface MediaRoom {
  readonly remainingImages: number | null;
  readonly remainingVideos: number | null;
  readonly canAddImage: boolean;
  readonly canAddVideo: boolean;
  readonly isFull: boolean;
}
