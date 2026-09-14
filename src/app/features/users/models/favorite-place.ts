import { PlaceKind } from './place-kind';

export interface FavoritePlace {
  readonly id: string;
  readonly placeName: string;
  readonly placeKind: PlaceKind;
  readonly categoryName: string;
  readonly governorateName: string;
  readonly savedAt: string;
}
