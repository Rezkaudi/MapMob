import { NamedReference } from '../../../shared/models/named-reference';

/** The governorate and area are set by an admin; the owner edits the rest. */
export interface StoreLocation {
  readonly governorate: NamedReference;
  readonly area: NamedReference;
  readonly address: string;
  readonly latitude: number;
  readonly longitude: number;
}
