import { MerchantStory } from '../models/merchant-story';

export interface StorySections {
  readonly active: readonly MerchantStory[];
  readonly expired: readonly MerchantStory[];
}

/** ISO moments sort as text, newest first. */
function byNewest(read: (story: MerchantStory) => string) {
  return (first: MerchantStory, second: MerchantStory) => read(second).localeCompare(read(first));
}

/** The page's two lists: the newest post leads the active ones, the latest end the expired ones. */
export function splitStories(items: readonly MerchantStory[]): StorySections {
  return {
    active: items
      .filter((story) => story.status === 'active')
      .sort(byNewest((story) => story.publishedAt)),
    expired: items
      .filter((story) => story.status === 'expired')
      .sort(byNewest((story) => story.expiresAt)),
  };
}
