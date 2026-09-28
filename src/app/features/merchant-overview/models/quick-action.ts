export interface QuickAction {
  readonly title: string;
  readonly description: string;
  readonly route: string;
  /** Matches a file in `public/assets/icons`. */
  readonly icon: string;
  /** Tailwind classes for the 48px icon tile and its glyph colour. */
  readonly tileClass: string;
  /** The first card is drawn in the blue gradient. */
  readonly isHighlighted: boolean;
}
