import { ApiFeature } from '../models/api-feature';
import { DbDomain } from '../models/db-domain';
import { DocsNavGroup, DocsNavLink } from '../models/docs-nav-link';
import { WHOLE_DATABASE_ID } from './whole-database';

const START_LINKS: readonly DocsNavLink[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'conventions', label: 'Conventions' },
];

const END_LINKS: readonly DocsNavLink[] = [
  { id: 'build-order', label: 'Build order' },
  { id: 'open-questions', label: 'Open questions' },
  { id: 'export', label: 'Export README / PDF' },
];

export function docsNavGroups(
  features: readonly ApiFeature[],
  domains: readonly Pick<DbDomain, 'id' | 'name'>[],
): DocsNavGroup[] {
  return [
    { title: 'Start here', links: START_LINKS },
    {
      title: 'Endpoints',
      links: features.map((feature) => ({
        id: feature.id,
        label: feature.name,
        count: feature.endpoints.length,
      })),
    },
    {
      title: 'Database',
      links: [
        { id: WHOLE_DATABASE_ID, label: 'Complete ERD' },
        ...domains.map((domain) => ({ id: domain.id, label: domain.name })),
      ],
    },
    { title: 'Wrap up', links: END_LINKS },
  ];
}
