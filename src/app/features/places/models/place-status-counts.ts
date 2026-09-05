import { PlaceStatus } from './place-status';

/** The totals behind the status chips above the table. */
export type PlaceStatusCounts = Record<PlaceStatus, number> & { readonly all: number };
