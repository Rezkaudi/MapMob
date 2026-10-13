const NOT_LETTER_OR_DIGIT = /[^\p{L}\p{N}\s-]/gu;
const SPACES = /[\s-]+/g;

/** A link-safe name; the live server needs one when a record is created. */
export function toNameSlug(name: string): string {
  return name.toLowerCase().replace(NOT_LETTER_OR_DIGIT, '').trim().replace(SPACES, '-');
}
