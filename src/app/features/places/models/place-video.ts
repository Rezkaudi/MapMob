export interface PlaceVideo {
  readonly id: string;
  readonly url: string;
  /** Still frame the card shows before the video plays. */
  readonly posterUrl: string;
  /** Running time as the design writes it, e.g. `01:24`. */
  readonly duration: string;
}
