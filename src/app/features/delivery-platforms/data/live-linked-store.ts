import { LiveReference } from '../../../core/http/live-reference';

/** The parts of `/admin/stores/{id}` the linked stores dialog shows. */
export interface LiveLinkedStore {
  readonly id: string;
  readonly name: string;
  readonly logoUrl?: string | null;
  readonly mainCategory: LiveReference | null;
  readonly location: {
    readonly governorate: LiveReference | null;
    readonly area: LiveReference | null;
  } | null;
}
