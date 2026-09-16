import { Subscription } from '../models/subscription';

/** Holds the seeded subscription records behind the mock repository. */
export class SubscriptionMockDatabase {
  constructor(private readonly entries: readonly Subscription[]) {}

  list(): readonly Subscription[] {
    return this.entries;
  }
}
