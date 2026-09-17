import { ShareBarTone } from '../../../shared/ui/share-bar/share-bar-tone';

/** One labelled bar, ready to show. */
export interface ShareRow {
  readonly label: string;
  readonly valueText: string;
  readonly shareText: string;
  readonly share: number;
  readonly tone: ShareBarTone;
}
