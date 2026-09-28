import { CountWords } from '../formatting/arabic-count';

/** The words a usage card counts with, e.g. "/ 5 منتجات" and "متبقي لك منتجان". */
export interface QuotaNouns {
  readonly limitWords: CountWords;
  /** "متبقي لك …" needs the subject form: منتجان, not منتجين. */
  readonly remainingWords: CountWords;
  readonly uncappedNotice: string;
}
