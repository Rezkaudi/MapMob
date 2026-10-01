import { StoryVisualCard } from './story-visual-card';

/** What the "عرض القصة" drawer shows. */
export interface StoryDetailView {
  readonly card: StoryVisualCard;
  readonly placeName: string;
  /** "30/09/2026 - 10:30". */
  readonly publishedText: string;
  /** "01/10/2026 - 10:30". */
  readonly endsText: string;
  /** "125 مشاهدة". */
  readonly viewsText: string;
}
