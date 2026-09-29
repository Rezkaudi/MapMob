import { buildDeliveryPlatformDraft, buildLinkedStore } from '../testing/delivery-platform-fixture';
import { DeliveryPlatformMockDatabase } from './delivery-platform-mock-database';
import { DeliveryPlatformMockSeed } from './delivery-platform-mock-seed';

const NOW = new Date('2026-09-29T10:00:00.000Z');
const FIRST_PAGE = { pageIndex: 0, pageSize: 4 };

function buildSeed(): DeliveryPlatformMockSeed {
  return {
    platforms: [
      {
        id: 'talabat',
        name: 'طلبات',
        latinName: 'talabat',
        logoUrl: null,
        websiteUrl: 'https://www.talabat.com',
        referralCount: 250,
        status: 'active',
        sortOrder: 2,
        createdAt: '2024-01-26T09:00:00.000Z',
      },
      {
        id: 'beeorder',
        name: 'بي أوردر',
        latinName: 'BeeOrder',
        logoUrl: null,
        websiteUrl: 'https://beeorder.com',
        referralCount: 150,
        status: 'active',
        sortOrder: 1,
        createdAt: '2024-03-02T09:00:00.000Z',
      },
      {
        id: 'foodzone',
        name: 'فود زون',
        latinName: 'FoodZone',
        logoUrl: null,
        websiteUrl: 'https://foodzone.sy',
        referralCount: 0,
        status: 'suspended',
        sortOrder: 3,
        createdAt: '2025-05-10T09:00:00.000Z',
      },
    ],
    linkedStores: {
      talabat: [buildLinkedStore({ id: 'place-1' }), buildLinkedStore({ id: 'place-2' })],
      beeorder: [buildLinkedStore({ id: 'place-2' }), buildLinkedStore({ id: 'place-3' })],
    },
  };
}

function createDatabase(): DeliveryPlatformMockDatabase {
  return new DeliveryPlatformMockDatabase(buildSeed(), () => NOW);
}

describe('DeliveryPlatformMockDatabase', () => {
  beforeEach(() => {
    URL.createObjectURL = () => 'blob:logo';
  });

  it('lists the platforms in their display order, each with its count of linked stores', () => {
    const page = createDatabase().page(FIRST_PAGE);

    expect(page.items.map((platform) => platform.id)).toEqual(['beeorder', 'talabat', 'foodzone']);
    expect(page.items.map((platform) => platform.linkedStoreCount)).toEqual([2, 2, 0]);
    expect(page.totalCount).toBe(3);
  });

  it('finds a platform by its Arabic or its Latin name, ignoring case', () => {
    const database = createDatabase();

    expect(database.page({ ...FIRST_PAGE, search: 'طلب' }).items[0].id).toBe('talabat');
    expect(database.page({ ...FIRST_PAGE, search: 'beeo' }).items[0].id).toBe('beeorder');
  });

  it('sorts by the date the platform was added', () => {
    const page = createDatabase().page({ ...FIRST_PAGE, sort: 'newest' });

    expect(page.items.map((platform) => platform.id)).toEqual(['foodzone', 'beeorder', 'talabat']);
  });

  it('adds up the four cards', () => {
    expect(createDatabase().summary()).toEqual({
      referralCount: 400,
      mostUsedPlatform: { id: 'talabat', name: 'طلبات', latinName: 'talabat' },
      linkedStoreCount: 3,
      activeCount: 2,
      platformCount: 3,
    });
  });

  it('adds a platform with no stores or referrals yet', () => {
    const database = createDatabase();

    const added = database.add(
      buildDeliveryPlatformDraft({
        name: 'يلا غو',
        latinName: 'yallago',
        logoFile: new File([''], 'a.png'),
      }),
    );

    expect(added).toMatchObject({
      name: 'يلا غو',
      latinName: 'yallago',
      logoUrl: 'blob:logo',
      linkedStoreCount: 0,
      referralCount: 0,
      createdAt: NOW.toISOString(),
    });
    expect(database.page({ ...FIRST_PAGE, pageSize: 10 }).totalCount).toBe(4);
  });

  it('refuses a second platform with the same Latin name', () => {
    expect(() =>
      createDatabase().add(buildDeliveryPlatformDraft({ latinName: 'TALABAT' })),
    ).toThrow('توجد منصة بهذا الاسم مسبقاً');
  });

  it('saves changes and keeps the logo unless it is replaced or removed', () => {
    const database = createDatabase();
    database.update('talabat', buildDeliveryPlatformDraft({ logoFile: new File([''], 'a.png') }));

    const kept = database.update(
      'talabat',
      buildDeliveryPlatformDraft({ name: 'طلبات سوريا', logoUrl: 'blob:logo' }),
    );
    expect(kept.name).toBe('طلبات سوريا');
    expect(kept.logoUrl).toBe('blob:logo');

    expect(database.update('talabat', buildDeliveryPlatformDraft()).logoUrl).toBeNull();
  });

  it('switches a platform off', () => {
    expect(createDatabase().setStatus('talabat', 'suspended').status).toBe('suspended');
  });

  it('deletes a platform with its links', () => {
    const database = createDatabase();

    database.remove('talabat');

    expect(database.summary().linkedStoreCount).toBe(2);
    expect(() => database.linkedStores('talabat')).toThrow();
  });

  it('lists the stores linked to one platform', () => {
    expect(
      createDatabase()
        .linkedStores('beeorder')
        .map((store) => store.id),
    ).toEqual(['place-2', 'place-3']);
    expect(createDatabase().linkedStores('foodzone')).toEqual([]);
  });
});
