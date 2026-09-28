const INDENT = 2;

export function prettyJson(value: unknown): string {
  return JSON.stringify(value, null, INDENT);
}
