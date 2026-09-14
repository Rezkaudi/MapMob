import { ListQuery } from '../../../shared/models/list-query';
import { CategoryKind } from './category-kind';
import { CategoryStatus } from './category-status';

export interface CategoryQuery extends ListQuery {
  readonly kind?: CategoryKind;
  readonly status?: CategoryStatus;
  readonly parentId?: string;
}
