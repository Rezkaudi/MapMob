import { NamedReference } from '../../../shared/models/named-reference';

/** A place with a switched-on link to one platform. */
export interface LinkedStore {
  readonly id: string;
  readonly name: string;
  readonly logoUrl: string | null;
  readonly category: NamedReference;
  readonly governorate: NamedReference;
  readonly area: NamedReference | null;
  readonly storeUrl: string;
  readonly linkedAt: string;
}
