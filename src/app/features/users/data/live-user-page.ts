import { LiveUser } from './live-user';

/** The users list names its total `totalCount`, unlike the other live lists. */
export interface LiveUserPage {
  readonly data: readonly LiveUser[];
  readonly meta: { readonly totalCount: number };
}
