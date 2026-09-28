import { DbDomain } from '../models/db-domain';
import { keysOnly } from './keys-only';

const domain: DbDomain = {
  id: 'd',
  name: 'D',
  description: '',
  layout: [['places']],
  tables: [
    {
      name: 'places',
      description: '',
      servedAs: '',
      columns: [
        { name: 'id', type: 'bigint', key: 'pk' },
        { name: 'code', type: 'varchar(20)', key: 'uq' },
        { name: 'name', type: 'varchar(150)' },
        { name: 'area_id', type: 'bigint', key: 'fk', references: 'areas.id' },
      ],
    },
  ],
};

describe('keysOnly', () => {
  it('keeps only the key columns of each table', () => {
    expect(keysOnly(domain).tables[0].columns.map((column) => column.name)).toEqual([
      'id',
      'code',
      'area_id',
    ]);
  });

  it('leaves the layout alone', () => {
    expect(keysOnly(domain).layout).toBe(domain.layout);
  });
});
