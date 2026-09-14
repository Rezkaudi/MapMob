import { RegionMockDatabase } from './region-mock-database';

const SEED = {
  governorates: [
    {
      id: 'gov-1',
      name: 'طرطوس',
      status: 'active' as const,
      updatedAt: '2024-01-12T00:00:00.000Z',
    },
    { id: 'gov-2', name: 'حمص', status: 'active' as const, updatedAt: '2024-01-12T00:00:00.000Z' },
  ],
  areas: [
    {
      id: 'area-1',
      governorateId: 'gov-1',
      name: 'صافيتا',
      subAreaCount: 5,
      placeCount: 300,
      status: 'active' as const,
      updatedAt: '2024-01-12T00:00:00.000Z',
    },
    {
      id: 'area-2',
      governorateId: 'gov-1',
      name: 'الدريكيش',
      subAreaCount: 5,
      placeCount: 200,
      status: 'active' as const,
      updatedAt: '2024-01-12T00:00:00.000Z',
    },
  ],
};

describe('RegionMockDatabase', () => {
  let database: RegionMockDatabase;

  beforeEach(() => {
    database = new RegionMockDatabase(SEED);
  });

  it('counts the areas and places of each governorate from its areas', () => {
    const [tartus, homs] = database.listGovernorates();

    expect(tartus).toMatchObject({ name: 'طرطوس', subAreaCount: 2, placeCount: 500 });
    expect(homs).toMatchObject({ name: 'حمص', subAreaCount: 0, placeCount: 0 });
  });

  it('puts a new governorate first', () => {
    const created = database.addGovernorate({ name: 'حماة', status: 'suspended' });

    expect(database.listGovernorates()[0]).toEqual(created);
    expect(created).toMatchObject({ name: 'حماة', status: 'suspended', subAreaCount: 0 });
  });

  it('updates a governorate and stamps the change time', () => {
    const updated = database.updateGovernorate('gov-2', { status: 'suspended' });

    expect(updated).toMatchObject({ id: 'gov-2', name: 'حمص', status: 'suspended' });
    expect(updated.updatedAt).not.toBe(SEED.governorates[1].updatedAt);
  });

  it('removes a governorate together with its areas', () => {
    database.removeGovernorate('gov-1');

    expect(database.findGovernorate('gov-1')).toBeUndefined();
    expect(database.listAreas('gov-1')).toEqual([]);
  });

  it('lists only the areas of one governorate', () => {
    expect(database.listAreas('gov-1').map((area) => area.name)).toEqual(['صافيتا', 'الدريكيش']);
    expect(database.listAreas('gov-2')).toEqual([]);
  });

  it('adds an area to its governorate, first in the list', () => {
    const created = database.addArea('gov-2', { name: 'تلكلخ', status: 'active' });

    expect(database.listAreas('gov-2')).toEqual([created]);
    expect(database.findGovernorate('gov-2')?.subAreaCount).toBe(1);
  });

  it('updates and removes an area', () => {
    database.updateArea('area-1', { name: 'صافيتا الجديدة' });
    database.removeArea('area-2');

    expect(database.listAreas('gov-1').map((area) => area.name)).toEqual(['صافيتا الجديدة']);
  });

  it('throws for an id it does not know', () => {
    expect(() => database.updateGovernorate('missing', { name: 'x' })).toThrowError();
    expect(() => database.updateArea('missing', { name: 'x' })).toThrowError();
  });
});
