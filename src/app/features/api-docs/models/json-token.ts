export type JsonTokenKind = 'key' | 'string' | 'number' | 'literal' | 'plain';

export interface JsonToken {
  readonly kind: JsonTokenKind;
  readonly text: string;
}
