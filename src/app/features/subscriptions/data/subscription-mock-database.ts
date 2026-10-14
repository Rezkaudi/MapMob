import { Subscription } from '../models/subscription';

/** Holds the seeded subscription records behind the mock repository, so a cancel sticks. */
export class SubscriptionMockDatabase {
  private entries: readonly Subscription[];

  constructor(seed: readonly Subscription[]) {
    this.entries = seed;
  }

  list(): readonly Subscription[] {
    return this.entries;
  }

  remove(id: string): void {
    this.entries = this.entries.filter((entry) => entry.id !== id);
  }
}
