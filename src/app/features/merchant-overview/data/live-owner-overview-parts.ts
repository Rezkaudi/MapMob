import { LiveOwnerCurrentSubscription } from './live-owner-current-subscription';
import { LiveOwnerInteraction } from './live-owner-interaction';
import { LiveOwnerReview } from '../../../shared/data/live-owner-review';
import { LiveOwnerSummary } from './live-owner-summary';

/** The four overview answers the page is built from. */
export interface LiveOwnerOverviewParts {
  readonly summary: LiveOwnerSummary;
  readonly interactions: readonly LiveOwnerInteraction[];
  readonly reviews: readonly LiveOwnerReview[];
  readonly subscription: LiveOwnerCurrentSubscription | null;
}
