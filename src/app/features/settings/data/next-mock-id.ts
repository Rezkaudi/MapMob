/** The id after the highest one with this prefix, e.g. "role-4" after "role-3". */
export function nextMockId(prefix: string, entries: readonly { readonly id: string }[]): string {
  const numbers = entries.map((entry) => Number(entry.id.slice(prefix.length)) || 0);
  return `${prefix}${Math.max(0, ...numbers) + 1}`;
}
