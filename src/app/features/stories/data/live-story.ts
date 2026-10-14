export interface LiveStory {
  readonly id: number;
  readonly store: { readonly id: number; readonly name: string };
  readonly type: string;
  readonly url: string;
  readonly status: string;
  readonly hidden_at: string | null;
  readonly created_at: string;
}
