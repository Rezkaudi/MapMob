import { TestBed } from '@angular/core/testing';
import { ApiReference } from '../models/api-reference';
import { buildEndpoint, buildFeature } from '../testing/api-docs-fixture';
import { API_REFERENCE } from '../data/api-reference';
import { ApiDocsStore } from './api-docs.store';

const list = buildEndpoint({ id: 'places-list' });
const remove = buildEndpoint({
  id: 'places-delete',
  method: 'DELETE',
  path: '/places/{id}',
});
const reference: ApiReference = {
  title: 'API',
  updatedOn: '2026-09-28',
  conventions: [],
  features: [buildFeature({ endpoints: [list, remove] })],
  domains: [],
  buildOrder: { head: [], rows: [] },
  wholeErdLayout: [],
  openQuestions: [],
};

function setUp(): InstanceType<typeof ApiDocsStore> {
  TestBed.configureTestingModule({
    providers: [ApiDocsStore, { provide: API_REFERENCE, useValue: reference }],
  });
  return TestBed.inject(ApiDocsStore);
}

describe('ApiDocsStore', () => {
  it('shows every endpoint at first, all closed', () => {
    const store = setUp();

    expect(store.visibleFeatures()).toEqual(reference.features);
    expect(store.isOpen('places-list')).toBe(false);
    expect(store.counts().total).toBe(2);
  });

  it('narrows the endpoints by search text', () => {
    const store = setUp();

    store.setSearch('delete');

    expect(store.visibleFeatures()[0].endpoints).toEqual([remove]);
    expect(store.visibleCount()).toBe(1);
  });

  it('narrows the endpoints by method, and clears it again', () => {
    const store = setUp();

    store.setMethodFilter('GET');
    expect(store.visibleCount()).toBe(1);

    store.setMethodFilter(null);
    expect(store.visibleCount()).toBe(2);
  });

  it('says when nothing matches', () => {
    const store = setUp();

    store.setSearch('no-such-path');

    expect(store.hasNoMatches()).toBe(true);
  });

  it('opens and closes one endpoint', () => {
    const store = setUp();

    store.toggleEndpoint('places-list');
    expect(store.isOpen('places-list')).toBe(true);

    store.toggleEndpoint('places-list');
    expect(store.isOpen('places-list')).toBe(false);
  });

  it('opens every visible endpoint, then closes them all', () => {
    const store = setUp();
    store.setMethodFilter('DELETE');

    store.openAllVisible();
    expect(store.isOpen('places-delete')).toBe(true);
    expect(store.isOpen('places-list')).toBe(false);

    store.closeAll();
    expect(store.isOpen('places-delete')).toBe(false);
  });

  it('shows every endpoint open while printing', () => {
    const store = setUp();

    store.startPrinting();
    expect(store.isOpen('places-list')).toBe(true);
    expect(store.visibleCount()).toBe(2);

    store.stopPrinting();
    expect(store.isOpen('places-list')).toBe(false);
  });

  it('counts the tables of every database domain', () => {
    TestBed.configureTestingModule({
      providers: [
        ApiDocsStore,
        {
          provide: API_REFERENCE,
          useValue: {
            ...reference,
            domains: [
              {
                id: 'a',
                name: 'A',
                description: '',
                layout: [],
                tables: [{ name: 't1' }, { name: 't2' }],
              },
              { id: 'b', name: 'B', description: '', layout: [], tables: [{ name: 't3' }] },
            ],
          },
        },
      ],
    });

    expect(TestBed.inject(ApiDocsStore).tableCount()).toBe(3);
  });

  it('remembers the section being read', () => {
    const store = setUp();

    store.setActiveSection('conventions');

    expect(store.activeSectionId()).toBe('conventions');
  });

  it('prints the whole reference even while a filter is set', () => {
    const store = setUp();
    store.setSearch('delete');

    store.startPrinting();

    expect(store.visibleCount()).toBe(2);
  });
});
