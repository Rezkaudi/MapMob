import { MediaTab } from './media-tab';

/** One tab over the gallery: "الكل 3". */
export interface MediaTabView {
  readonly value: MediaTab;
  readonly label: string;
  readonly icon: string;
  readonly count: number;
}
