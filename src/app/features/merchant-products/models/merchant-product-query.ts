import { ListSort } from '../../../shared/models/list-sort';

/** What the products page asks the server for. */
export interface MerchantProductQuery {
  readonly search: string;
  readonly sort: ListSort | null;
}
