import { createPlace } from '../testing/place-fixture';
import { PlaceMockDatabase } from './place-mock-database';

function createDatabase() {
  return new PlaceMockDatabase([
    createPlace(),
    createPlace({ id: 'place-2', status: 'pending' }),
    createPlace({ id: 'place-3', status: 'suspended' }),
  ]);
}

describe('PlaceMockDatabase', () => {
  it('sets the status of every named place', () => {
    const database = createDatabase();

    database.setStatus(['place-1', 'place-2'], 'suspended');

    expect(database.list().map((place) => place.status)).toEqual([
      'suspended',
      'suspended',
      'suspended',
    ]);
  });

  it('removes every named place', () => {
    const database = createDatabase();

    database.remove(['place-1', 'place-3']);

    expect(database.list().map((place) => place.id)).toEqual(['place-2']);
  });

  it('refuses to write to a place it does not hold', () => {
    const database = createDatabase();

    expect(() => database.setStatus(['place-9'], 'active')).toThrowError(/place-9/);
    expect(() => database.remove(['place-9'])).toThrowError(/place-9/);
  });

  it('finds one place by id', () => {
    expect(createDatabase().find('place-2').status).toBe('pending');
  });
});
