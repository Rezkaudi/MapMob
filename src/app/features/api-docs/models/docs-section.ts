/** A titled block of prose, with an optional table and code sample. */
export interface DocsSection {
  readonly id: string;
  readonly title: string;
  readonly paragraphs: readonly string[];
  readonly table?: DocsTable;
  readonly code?: string;
}

export interface DocsTable {
  readonly head: readonly string[];
  readonly rows: readonly (readonly string[])[];
}
