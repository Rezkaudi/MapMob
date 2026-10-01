import {
  VIEW_WORDS,
  formatArabicCount,
  pickArabicCountWord,
} from '../../../shared/formatting/arabic-count';
import { formatGroupedNumber } from '../../../shared/formatting/grouped-number';

const LAST_COUNT_SAID_BY_NOUN = 2;

/** "348 مشاهدة", as every story card counts its views. */
export function formatStoryViews(viewCount: number): string {
  if (viewCount === 0) {
    return `0 ${VIEW_WORDS.many}`;
  }
  if (viewCount <= LAST_COUNT_SAID_BY_NOUN) {
    return formatArabicCount(viewCount, VIEW_WORDS);
  }
  return `${formatGroupedNumber(viewCount)} ${pickArabicCountWord(viewCount, VIEW_WORDS)}`;
}
