import { DbDomain } from '../../models/db-domain';
import { ID, TIMESTAMPS, adminReference } from './db-columns';

export const CONTENT_DOMAIN: DbDomain = {
  id: 'db-content',
  name: 'Content and platform settings',
  description: 'The fixed pages the app shows, the FAQ, and platform-wide options.',
  layout: [['content_pages'], ['faq_questions', 'platform_settings']],
  tables: [
    {
      name: 'content_pages',
      description: 'One row per fixed page. Seed all four.',
      servedAs: '/content/pages',
      columns: [
        ID,
        { name: 'kind', type: "enum('about','terms','privacy','contact')", key: 'uq' },
        { name: 'title', type: 'varchar(120)' },
        {
          name: 'body_html',
          type: 'mediumtext',
          isNullable: true,
          note: 'about.summary, legal body, contact.introduction.',
        },
        { name: 'banner_path', type: 'varchar(255)', isNullable: true, note: 'About only.' },
        {
          name: 'fields',
          type: 'json',
          note: 'Page-only fields: about {phone,email,address}; contact {supportPhone,...,whatsappUrl}.',
        },
        { name: 'status', type: "enum('published','draft')" },
        adminReference('updated_by_admin_id', ''),
        ...TIMESTAMPS,
      ],
    },
    {
      name: 'faq_questions',
      description: 'The FAQ. The fifth content page row (kind faq) is built from this table.',
      servedAs: '/content/faq',
      columns: [
        ID,
        { name: 'question', type: 'varchar(200)' },
        { name: 'answer_html', type: 'text' },
        { name: 'sort_order', type: 'smallint unsigned' },
        ...TIMESTAMPS,
      ],
    },
    {
      name: 'platform_settings',
      description: 'Key-value store for the platform tab.',
      servedAs: '/settings/platform',
      columns: [
        {
          name: 'key',
          type: 'varchar(60)',
          key: 'pk',
          note: 'app_name, logo_path, support_email, support_phone, distance_unit, ...',
        },
        { name: 'value', type: 'json' },
        { name: 'updated_at', type: 'timestamp', isNullable: true },
      ],
    },
  ],
};
