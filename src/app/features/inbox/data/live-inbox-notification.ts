interface LiveInboxText {
  readonly type?: string;
  readonly title?: string;
  readonly body?: string;
  readonly message?: string;
}

/** The inbox has had no row yet, so both a flat row and a Laravel notification are read. */
export interface LiveInboxNotification extends LiveInboxText {
  readonly id: number | string;
  readonly data?: LiveInboxText | null;
  readonly is_read?: boolean;
  readonly read_at?: string | null;
  readonly created_at: string;
}
