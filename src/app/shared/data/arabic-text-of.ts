import { LiveTranslatedText } from './in-both-languages';

/** A per-language text of the /owner routes; PHP sends an empty one as `[]`. */
export type LiveOptionalText = Partial<LiveTranslatedText> | readonly never[] | null;

/** The Arabic words, else the English ones; null when both are empty. */
export function arabicTextOf(text: LiveOptionalText | undefined): string | null {
  if (!text || Array.isArray(text)) {
    return null;
  }
  const words =
    (text as Partial<LiveTranslatedText>).ar || (text as Partial<LiveTranslatedText>).en;
  return words || null;
}
