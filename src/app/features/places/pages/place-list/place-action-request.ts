import { PlaceAction } from './place-action';

export interface PlaceActionRequest {
  readonly action: PlaceAction;
  readonly ids: readonly string[];
  /** The row that asked, named in the dialog. Empty when the bulk bar asked. */
  readonly placeName: string;
}
