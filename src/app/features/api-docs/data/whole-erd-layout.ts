import { DbDomain } from '../models/db-domain';

/** Columns of the complete ERD, left to right; each table sits next to the tables it links to. */
export const WHOLE_ERD_LAYOUT: DbDomain['layout'] = [
  ['roles', 'role_permissions', 'admin_alert_settings', 'admin_inbox_items'],
  ['admins', 'content_pages', 'faq_questions', 'platform_settings'],
  ['governorates', 'areas', 'push_notifications', 'push_notification_recipients'],
  ['categories', 'places'],
  ['place_working_hours', 'place_media', 'products', 'offer_products', 'offers'],
  ['users', 'favorites', 'user_activities', 'device_tokens'],
  ['reviews', 'review_reports', 'complaints', 'complaint_attachments', 'ads', 'ad_events'],
  ['subscription_plans', 'plan_features', 'subscriptions', 'payments', 'payment_methods'],
];
