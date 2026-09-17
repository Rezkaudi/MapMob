/** "60/0": the limit, then how many characters are typed, as the form designs draw it. */
export function formatCharacterCount(text: string, maxLength: number): string {
  return `${maxLength}/${text.length}`;
}
