import { ApiReference } from '../models/api-reference';
import { buildEndpoint, buildFeature } from '../testing/api-docs-fixture';
import { buildApiReferenceMarkdown } from './api-reference-markdown';

const reference: ApiReference = {
  title: 'MapMob Admin API',
  updatedOn: '2026-09-28',
  conventions: [
    {
      id: 'paging',
      title: 'Paging',
      paragraphs: ['pageIndex is zero-based.'],
      code: 'GET /places',
    },
  ],
  features: [
    buildFeature({
      endpoints: [buildEndpoint(), buildEndpoint({ id: 'b', method: 'DELETE' })],
    }),
    buildFeature({
      id: 'owner-place',
      name: 'Own place',
      app: 'owner',
      permissionModule: null,
      endpoints: [buildEndpoint({ id: 'owner-place-get', path: '/owner/place' })],
    }),
  ],
  domains: [
    {
      id: 'db-locations',
      name: 'Locations',
      description: '',
      layout: [['governorates']],
      tables: [
        {
          name: 'governorates',
          description: '',
          servedAs: '',
          columns: [{ name: 'id', type: 'bigint', key: 'pk' }],
        },
      ],
    },
    {
      id: 'db-catalog',
      name: 'Catalog',
      description: '',
      layout: [['places']],
      tables: [
        {
          name: 'places',
          description: '',
          servedAs: '',
          columns: [
            { name: 'id', type: 'bigint', key: 'pk' },
            { name: 'governorate_id', type: 'bigint', key: 'fk', references: 'governorates.id' },
          ],
        },
      ],
    },
  ],
  wholeErdLayout: [['governorates'], ['places']],
  buildOrder: { head: ['Step', 'What'], rows: [['1', 'Fix the 500']] },
  openQuestions: ['Soft delete?'],
};
const markdown = buildApiReferenceMarkdown(reference);

describe('buildApiReferenceMarkdown', () => {
  it('opens with the title and the date', () => {
    expect(markdown.startsWith('# MapMob Admin API\n')).toBe(true);
    expect(markdown).toContain('Updated 2026-09-28');
  });

  it('counts the endpoints by method', () => {
    expect(markdown).toContain('| 3 | 2 | 0 | 0 | 0 | 1 |');
  });

  it('serves both the admin dashboard and the place owner app', () => {
    expect(markdown).toContain('the admin dashboard and the place owner app');
  });

  it('splits the endpoints by app, admin dashboard first', () => {
    const adminAt = markdown.indexOf('**Admin dashboard** — 2 endpoints');
    const ownerAt = markdown.indexOf('**Place owner app** — 1 endpoints');

    expect(adminAt).toBeGreaterThan(markdown.indexOf('## Endpoints'));
    expect(ownerAt).toBeGreaterThan(adminAt);
    expect(markdown.indexOf('### Own place')).toBeGreaterThan(ownerAt);
  });

  it('writes the sections in reading order', () => {
    const order = [
      '## Contents',
      '## Conventions',
      '## Endpoints',
      '## Database',
      '## Build order',
      '## Open questions',
    ];
    const positions = order.map((heading) => markdown.indexOf(heading));

    expect(positions.every((position) => position >= 0)).toBe(true);
    expect([...positions].sort((first, second) => first - second)).toEqual(positions);
  });

  it('writes a convention with its code sample', () => {
    expect(markdown).toContain('### Paging\n\npageIndex is zero-based.\n\n```\nGET /places\n```');
  });

  it('lists each feature with a table of its endpoints', () => {
    expect(markdown).toContain('### Places');
    expect(markdown).toContain('| `GET` | [`/places`](#places-list) | The paged places table. |');
    expect(markdown).not.toMatch(/Ready|Not built|Needs changes/);
  });

  it('draws the complete ERD first, with the links between groups', () => {
    const whole = markdown.indexOf('### Complete ERD');

    expect(whole).toBeGreaterThan(markdown.indexOf('## Database'));
    expect(whole).toBeLessThan(markdown.indexOf('### Locations'));
    expect(markdown).toContain('  governorates ||--o{ places : "governorate_id"');
  });

  it('numbers the open questions', () => {
    expect(markdown).toContain('1. Soft delete?');
  });
});
