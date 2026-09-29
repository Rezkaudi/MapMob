import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { API_REFERENCE } from '../../data/api-reference';
import { ApiReferenceExporter } from '../../export/api-reference-exporter';
import { ApiReference } from '../../models/api-reference';
import { SectionScroller } from '../../state/section-scroller';
import { buildEndpoint, buildFeature } from '../../testing/api-docs-fixture';
import { ClipboardWriter } from '../../../../shared/browser/clipboard-writer';
import { ApiDocsPage } from './api-docs';

const reference: ApiReference = {
  title: 'MapMob Admin API — Backend Reference',
  updatedOn: '2026-09-28',
  conventions: [{ id: 'paging', title: 'Paging', paragraphs: ['pageIndex is zero-based.'] }],
  features: [
    buildFeature({
      endpoints: [
        buildEndpoint({ id: 'places-list', path: '/places' }),
        buildEndpoint({
          id: 'places-delete',
          method: 'DELETE',
          path: '/places/{id}',
        }),
      ],
    }),
    buildFeature({
      id: 'users',
      name: 'App users',
      endpoints: [buildEndpoint({ id: 'users-list', path: '/users' })],
    }),
  ],
  domains: [
    {
      id: 'db-locations',
      name: 'Locations',
      description: 'Two levels.',
      layout: [['governorates']],
      tables: [
        {
          name: 'governorates',
          description: 'Top.',
          servedAs: '/governorates',
          columns: [{ name: 'id', type: 'bigint', key: 'pk' }],
        },
      ],
    },
  ],
  buildOrder: { head: ['Step', 'What'], rows: [['1', 'Fix the 500']] },
  wholeErdLayout: [['governorates']],
  openQuestions: ['Soft delete?'],
};

const openCardsAtPrint: number[] = [];
const route: { snapshot: { fragment: string | null } } = { snapshot: { fragment: null } };
const exporter = { downloadReadme: vi.fn(), printPdf: vi.fn() };
const scroller = {
  scrollTo: vi.fn(),
  replaceHash: vi.fn(),
  linkTo: (id: string) => `/docs#${id}`,
  activeSectionIn: vi.fn(() => null),
};

function render() {
  TestBed.configureTestingModule({
    providers: [
      { provide: API_REFERENCE, useValue: reference },
      { provide: ApiReferenceExporter, useValue: exporter },
      { provide: SectionScroller, useValue: scroller },
      { provide: ActivatedRoute, useValue: route },
      { provide: ClipboardWriter, useValue: { write: vi.fn() } },
    ],
  });
  const fixture = TestBed.createComponent(ApiDocsPage);
  fixture.detectChanges();
  exporter.printPdf.mockImplementation(() =>
    openCardsAtPrint.push(fixture.nativeElement.querySelectorAll('[data-endpoint-details]').length),
  );
  return fixture;
}

function cardCount(element: HTMLElement): number {
  return element.querySelectorAll('app-endpoint-card').length;
}

describe('ApiDocsPage', () => {
  beforeEach(() => {
    exporter.downloadReadme.mockReset();
    exporter.printPdf.mockReset();
    scroller.scrollTo.mockReset();
    scroller.replaceHash.mockReset();
    route.snapshot.fragment = null;
    openCardsAtPrint.length = 0;
  });

  it('reads left to right in English', () => {
    const root: HTMLElement = render().nativeElement.querySelector('[dir]');

    expect(root.getAttribute('dir')).toBe('ltr');
    expect(root.getAttribute('lang')).toBe('en');
  });

  it('shows every part of the reference', () => {
    const element: HTMLElement = render().nativeElement;

    expect(element.querySelector('h1')?.textContent).toContain('MapMob Admin API');
    for (const id of [
      'overview',
      'conventions',
      'endpoints',
      'places',
      'users',
      'database',
      'db-whole',
      'db-locations',
      'build-order',
      'open-questions',
      'export',
    ]) {
      expect(element.querySelector(`#${id}`), id).toBeTruthy();
    }
    expect(cardCount(element)).toBe(3);
    expect(element.querySelector('app-erd-diagram')).toBeTruthy();
    expect(element.textContent).toContain('Soft delete?');
  });

  it('narrows the endpoints as the admin types', () => {
    const fixture = render();
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input[type="search"]');

    input.value = 'users';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(cardCount(fixture.nativeElement)).toBe(1);
  });

  it('says so when nothing matches', () => {
    const fixture = render();
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input[type="search"]');

    input.value = 'nothing-like-this';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('No endpoint matches');
  });

  it('opens an endpoint when its header is clicked', () => {
    const fixture = render();

    fixture.nativeElement.querySelector('#places-list button').click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('[data-endpoint-details]')).toHaveLength(1);
  });

  it('puts an opened endpoint in the address, so the link can be shared', () => {
    const fixture = render();

    fixture.nativeElement.querySelector('#places-list button').click();

    expect(scroller.replaceHash).toHaveBeenCalledWith('places-list');
  });

  it('opens and scrolls to the endpoint a shared link names', async () => {
    route.snapshot.fragment = 'users-list';
    const fixture = render();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#users-list [data-endpoint-details]')).toBeTruthy();
    expect(scroller.scrollTo).toHaveBeenCalledWith('users-list');
  });

  it('offers a section picker for small screens', () => {
    const fixture = render();
    const picker: HTMLSelectElement = fixture.nativeElement.querySelector(
      'select[aria-label="Jump to section"]',
    );

    picker.value = 'users';
    picker.dispatchEvent(new Event('change'));

    expect(scroller.scrollTo).toHaveBeenCalledWith('users');
  });

  it('lets keyboard users skip to the content', () => {
    const skip: HTMLAnchorElement = render().nativeElement.querySelector(
      'a[href="/docs#docs-content"]',
    );

    expect(skip.textContent).toContain('Skip to content');
  });

  it('scrolls to a section picked in the sidebar', () => {
    const fixture = render();

    fixture.nativeElement.querySelector('aside a[href="/docs#users"]').click();

    expect(scroller.scrollTo).toHaveBeenCalledWith('users');
  });

  it('downloads the README from the export panel', () => {
    const fixture = render();

    fixture.nativeElement.querySelector('[data-export="readme"]').click();

    expect(exporter.downloadReadme).toHaveBeenCalled();
  });

  it('prints with every endpoint open, then closes them again', async () => {
    const fixture = render();

    fixture.nativeElement.querySelector('[data-export="pdf"]').click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(openCardsAtPrint).toEqual([3]);
    expect(fixture.nativeElement.querySelectorAll('[data-endpoint-details]')).toHaveLength(0);
  });
});
