/** A text the server keeps per language. */
export interface LiveTranslatedText {
  readonly ar: string;
  readonly en: string;
}

/** The panel has one text box, so the same words go in both languages the server asks for. */
export function inBothLanguages(text: string): LiveTranslatedText {
  return { ar: text, en: text };
}
