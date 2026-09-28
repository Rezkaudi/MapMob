interface MockNotification {
  readonly id: string;
  readonly receivedAt: string;
  readonly isRead: boolean;
}

/** In-memory store behind a mock notification repository, so "read" sticks between requests. */
export class NotificationMockDatabase<TNotification extends MockNotification> {
  private notifications: readonly TNotification[];

  constructor(seed: readonly TNotification[]) {
    this.notifications = [...seed].sort((left, right) =>
      right.receivedAt.localeCompare(left.receivedAt),
    );
  }

  list(): readonly TNotification[] {
    return this.notifications;
  }

  markAsRead(id: string): TNotification {
    const notification = this.notifications.find((candidate) => candidate.id === id);
    if (!notification) {
      throw new Error(`لم يتم العثور على الإشعار ${id}`);
    }
    const updated = { ...notification, isRead: true };
    this.notifications = this.notifications.map((candidate) =>
      candidate.id === id ? updated : candidate,
    );
    return updated;
  }
}
