/** The social pages the store page edits, in the order they are sent. */
export const SOCIAL_PLATFORMS = ['facebook', 'instagram', 'telegram'] as const;

export type SocialPlatform = (typeof SOCIAL_PLATFORMS)[number];
