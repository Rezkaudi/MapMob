import { DbDomain } from '../models/db-domain';
import { WHOLE_DATABASE_ID, wholeDatabase } from './whole-database';

const table = (name: string) => ({ name, description: '', servedAs: '', columns: [] });
const locations: DbDomain = {
  id: 'a',
  name: 'A',
  description: '',
  layout: [],
  tables: [table('governorates')],
};
const catalog: DbDomain = {
  id: 'b',
  name: 'B',
  description: '',
  layout: [],
  tables: [table('places')],
};

describe('wholeDatabase', () => {
  it('puts every table of every group in one diagram, with its own layout', () => {
    const whole = wholeDatabase([locations, catalog], [['governorates'], ['places']]);

    expect(whole.id).toBe(WHOLE_DATABASE_ID);
    expect(whole.tables.map((one) => one.name)).toEqual(['governorates', 'places']);
    expect(whole.layout).toEqual([['governorates'], ['places']]);
  });
});
