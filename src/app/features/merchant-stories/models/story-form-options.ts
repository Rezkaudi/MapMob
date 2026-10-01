import { MerchantStory } from './merchant-story';

/** What the story dialog opens with. `story` is null for a new story. */
export interface StoryFormOptions {
  readonly story: MerchantStory | null;
  /** The plan line over the form; null on an edit, which takes no new room. */
  readonly notice: string | null;
}
