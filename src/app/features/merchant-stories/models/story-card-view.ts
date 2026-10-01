import { MerchantStory } from './merchant-story';

/** What one story card shows. */
export interface StoryCardView {
  readonly story: MerchantStory;
  readonly isActive: boolean;
  readonly isVideo: boolean;
  /** "نشطة" or "منتهية". */
  readonly statusLabel: string;
  /** "متبقي 14 ساعة"; null once the story has expired. */
  readonly remainingText: string | null;
  /** "اليوم • 10:30 AM" while active, "18 أكتوبر • 02:00 PM" after. */
  readonly publishedText: string;
  /** "19 أكتوبر • 02:00 PM". */
  readonly endedText: string;
  /** "348 مشاهدة". */
  readonly viewsText: string;
}
