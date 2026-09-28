export interface SectionTop {
  readonly id: string;
  /** Distance from the top of the scroll box, negative once scrolled past. */
  readonly top: number;
}

/**
 * The section the reader is in: the last one whose top has passed the reading line, or the
 * last one of all at the end of the page, where a short final section can never reach the line.
 */
export function activeSectionAt(
  tops: readonly SectionTop[],
  readingLine: number,
  isAtEnd = false,
): string | null {
  if (tops.length === 0) {
    return null;
  }
  if (isAtEnd) {
    return tops[tops.length - 1].id;
  }
  const passed = tops.filter((section) => section.top <= readingLine);
  return (passed.at(-1) ?? tops[0]).id;
}
