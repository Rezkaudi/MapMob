/** Keeps a saved value selectable even when the list on screen does not offer it. */
export function withSavedOption(
  options: readonly string[],
  saved: string | undefined,
): readonly string[] {
  if (!saved || options.includes(saved)) {
    return options;
  }
  return [saved, ...options];
}
