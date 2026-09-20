import { InboxNotification } from '../models/inbox-notification';

/** In-memory store behind the mock repository, so "read" sticks between requests. */
export class InboxMockDatabase {
  private notifications: readonly InboxNotification[];

  constructor(seed: readonly InboxNotification[]) {
    this.notifications = [...seed].sort((left, right) =>
      right.receivedAt.localeCompare(left.receivedAt),
    );
  }

  list(): readonly InboxNotification[] {
    return this.notifications;
  }

  markAsRead(id: string): InboxNotification {
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
