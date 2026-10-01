import { NamedReference } from '../../../shared/models/named-reference';
import { MerchantStory } from './merchant-story';

/** Everything the stories page reads in one request. */
export interface MerchantStoryLibrary {
  readonly plan: NamedReference;
  readonly place: NamedReference;
  /** How many stories may be active at once; null = no cap. */
  readonly activeStoryLimit: number | null;
  readonly items: readonly MerchantStory[];
}
