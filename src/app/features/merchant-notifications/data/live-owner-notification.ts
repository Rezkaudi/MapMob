/** A row of GET /owner/notifications (a Laravel database notification); no row has been seen yet. */
export interface LiveOwnerNotification {
  readonly id: string | number;
  readonly type?: string | null;
  readonly title?: string | null;
  readonly body?: string | null;
  readonly message?: string | null;
  readonly category?: string | null;
  readonly data?: LiveOwnerNotificationData | null;
  readonly read_at?: string | null;
  readonly readAt?: string | null;
  readonly isRead?: boolean;
  readonly created_at?: string | null;
  readonly createdAt?: string | null;
}

export interface LiveOwnerNotificationData {
  readonly title?: string | null;
  readonly body?: string | null;
  readonly message?: string | null;
  readonly category?: string | null;
  readonly subject_id?: string | number | null;
  readonly offer_id?: string | number | null;
  readonly review_id?: string | number | null;
}
