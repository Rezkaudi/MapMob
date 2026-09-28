export interface ScriptRun {
  readonly text: string;
  readonly isArabic: boolean;
}

const ARABIC_LETTERS =
  '\\u0600-\\u06FF\\u0750-\\u077F\\u08A0-\\u08FF\\uFB50-\\uFDFF\\uFE70-\\uFEFF';
/** Arabic letters, and the spaces and marks between them, so a phrase stays one run. */
const ARABIC_RUN = new RegExp(
  `[${ARABIC_LETTERS}](?:[${ARABIC_LETTERS}\\s،٪]*[${ARABIC_LETTERS}])?`,
  'g',
);

/** Monospace fonts draw Arabic letters unjoined, so Arabic runs need their own font. */
export function splitScriptRuns(text: string): ScriptRun[] {
  const runs: ScriptRun[] = [];
  let latinStart = 0;
  for (const match of text.matchAll(ARABIC_RUN)) {
    const start = match.index ?? 0;
    if (start > latinStart) {
      runs.push({ text: text.slice(latinStart, start), isArabic: false });
    }
    runs.push({ text: match[0], isArabic: true });
    latinStart = start + match[0].length;
  }
  if (latinStart < text.length) {
    runs.push({ text: text.slice(latinStart), isArabic: false });
  }
  return runs;
}
