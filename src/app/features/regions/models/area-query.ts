import { GovernorateQuery } from './governorate-query';

export interface AreaQuery extends GovernorateQuery {
  readonly governorateId: string;
}
