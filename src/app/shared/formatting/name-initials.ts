const INITIALS_WORD_COUNT = 2;

export function getNameInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, INITIALS_WORD_COUNT)
    .map((word) => word[0])
    .join(' ');
}
