import { OwnerNotification } from '../models/owner-notification';
import { OwnerNotificationCategory } from '../models/owner-notification-category';
import { LiveOwnerNotification } from './live-owner-notification';

const CATEGORY_HINTS: readonly [string, OwnerNotificationCategory][] = [
  ['subscription', 'subscriptions'],
  ['review', 'reviews'],
  ['offer', 'offers'],
];

export function toOwnerNotification(live: LiveOwnerNotification): OwnerNotification {
  const data = live.data ?? {};
  const subjectId = data.subject_id ?? data.offer_id ?? data.review_id ?? null;
  return {
    id: String(live.id),
    category: categoryOf(`${data.category ?? live.category ?? ''} ${live.type ?? ''}`),
    title: data.title ?? live.title ?? '',
    body: data.body ?? data.message ?? live.body ?? live.message ?? '',
    receivedAt: live.createdAt ?? live.created_at ?? '',
    isRead: live.isRead ?? Boolean(live.readAt ?? live.read_at),
    subjectId: subjectId === null ? null : String(subjectId),
  };
}

function categoryOf(hint: string): OwnerNotificationCategory {
  const lowered = hint.toLowerCase();
  return CATEGORY_HINTS.find(([word]) => lowered.includes(word))?.[1] ?? 'system';
}
