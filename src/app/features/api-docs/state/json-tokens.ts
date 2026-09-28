import { JsonToken, JsonTokenKind } from '../models/json-token';

/** Groups: 1 a string, 2 the colon that makes it a key, 3 a number, 4 a literal. */
const TOKEN_PATTERN =
  /("(?:\\.|[^"\\])*")(\s*:)?|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)|\b(true|false|null)\b/g;

function kindOf(match: RegExpMatchArray): JsonTokenKind {
  if (match[1] !== undefined) {
    return match[2] !== undefined ? 'key' : 'string';
  }
  return match[3] !== undefined ? 'number' : 'literal';
}

/** Splits pretty JSON into coloured pieces that join back into the same text. */
export function tokenizeJson(text: string): JsonToken[] {
  const tokens: JsonToken[] = [];
  let plainStart = 0;
  for (const match of text.matchAll(TOKEN_PATTERN)) {
    const start = match.index ?? 0;
    const value = match[1] ?? match[0];
    if (start > plainStart) {
      tokens.push({ kind: 'plain', text: text.slice(plainStart, start) });
    }
    tokens.push({ kind: kindOf(match), text: value });
    plainStart = start + value.length;
  }
  if (plainStart < text.length) {
    tokens.push({ kind: 'plain', text: text.slice(plainStart) });
  }
  return tokens;
}
