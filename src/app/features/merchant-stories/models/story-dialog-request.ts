import { MerchantStory } from './merchant-story';

/** Which overlay the page shows: the add or edit form, the drawer or the delete question. */
export type StoryDialogRequest =
  | { readonly kind: 'add' }
  | { readonly kind: 'edit'; readonly story: MerchantStory }
  | { readonly kind: 'view'; readonly story: MerchantStory }
  | { readonly kind: 'delete'; readonly story: MerchantStory };
