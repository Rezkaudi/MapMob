import { DbDomain } from '../models/db-domain';
import { databaseMarkdown, mermaidDiagram } from './markdown-database';

const domain: DbDomain = {
  id: 'db-locations',
  name: 'Locations',
  description: 'Two levels.',
  layout: [['governorates'], ['areas']],
  tables: [
    {
      name: 'governorates',
      description: 'Top level.',
      servedAs: '/governorates',
      columns: [
        { name: 'id', type: 'bigint unsigned', key: 'pk' },
        { name: 'status', type: "enum('active','suspended')" },
      ],
    },
    {
      name: 'areas',
      description: 'Inside a governorate.',
      servedAs: '/areas',
      columns: [
        { name: 'id', type: 'bigint unsigned', key: 'pk' },
        {
          name: 'governorate_id',
          type: 'bigint unsigned',
          key: 'fk',
          references: 'governorates.id',
        },
        {
          name: 'place_id',
          type: 'bigint unsigned',
          key: 'fk',
          references: 'places.id',
          isNullable: true,
        },
      ],
      indexes: ['UNIQUE (governorate_id, name_ar)'],
    },
  ],
};

describe('mermaidDiagram', () => {
  const diagram = mermaidDiagram(domain);

  it('draws each table with simple types and key marks', () => {
    expect(diagram).toContain('  governorates {\n    bigint id PK\n    enum status\n  }');
    expect(diagram).toContain('    bigint governorate_id FK');
  });

  it('links a key column to its table inside the domain only', () => {
    expect(diagram).toContain('  governorates ||--o{ areas : "governorate_id"');
    expect(diagram).not.toContain('places');
  });
});

describe('databaseMarkdown', () => {
  const markdown = databaseMarkdown([domain]);

  it('puts each domain under a heading with its diagram', () => {
    expect(markdown).toContain('### Locations');
    expect(markdown).toContain('```mermaid\nerDiagram');
  });

  it('lists every column with where its key points', () => {
    expect(markdown).toContain('#### `areas`');
    expect(markdown).toContain(
      '| `governorate_id` | bigint unsigned | no | FK → `governorates.id` | — |',
    );
    expect(markdown).toContain('| `place_id` | bigint unsigned | yes | FK → `places.id` | — |');
  });

  it('lists the indexes', () => {
    expect(markdown).toContain('Indexes: `UNIQUE (governorate_id, name_ar)`');
  });
});
