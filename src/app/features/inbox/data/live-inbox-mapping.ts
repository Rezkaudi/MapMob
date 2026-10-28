import { InboxCategory } from '../models/inbox-category';
import { InboxNotification } from '../models/inbox-notification';
import { LiveInboxNotification } from './live-inbox-notification';

const CATEGORY_BY_WORD: readonly (readonly [string, InboxCategory])[] = [
  ['complaint', 'complaints'],
  ['report', 'complaints'],
  ['subscription', 'subscriptions'],
  ['offer', 'offers'],
];

function toCategory(type: string): InboxCategory {
  const kind = type.toLowerCase();
  return CATEGORY_BY_WORD.find(([word]) => kind.includes(word))?.[1] ?? 'system';
}

export function toInboxNotification(row: LiveInboxNotification): InboxNotification {
  const data = row.data ?? {};
  return {
    id: String(row.id),
    category: toCategory(row.type ?? data.type ?? ''),
    title: row.title ?? data.title ?? '',
    body: row.body ?? row.message ?? data.body ?? data.message ?? '',
    receivedAt: row.created_at,
    isRead: row.is_read ?? Boolean(row.read_at),
  };
}
