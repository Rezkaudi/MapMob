import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { Observable, of } from 'rxjs';
import { CLOCK } from '../../../../core/config/clock';
import { FileSaver } from '../../../../shared/files/file-saver';
import { OfferRepository } from '../../data/offer.repository';
import { buildOffer, buildOfferDetail } from '../../testing/offer-fixture';
import { OfferList } from './offer-list';

const DETAIL = buildOfferDetail();
const SUMMARY = { totalCount: 34, activeCount: 16, scheduledCount: 14, endedCount: 23 };

function createPage(overrides: Partial<OfferRepository> = {}) {
  const calls: string[] = [];
  const repository: Partial<OfferRepository> = {
    getOffers: () =>
      of({
        items: [buildOffer(), buildOffer({ id: 'offer-2', status: 'paused' })],
        totalCount: 3000,
      }),
    getSummary: () => of(SUMMARY),
    getOfferDetail: () => of(DETAIL),
    pauseOffer: (id) => {
      calls.push(`pause ${id}`);
      return of(buildOffer({ status: 'paused' }));
    },
    deleteOffer: (id) => {
      calls.push(`delete ${id}`);
      return of(undefined) as Observable<void>;
    },
    exportOffers: () => of(new Blob(['csv'])),
    ...overrides,
  };
  const savedFiles: string[] = [];
  TestBed.configureTestingModule({
    providers: [
      provideRouter([]),
      { provide: OfferRepository, useValue: repository },
      { provide: CLOCK, useValue: () => new Date(2026, 8, 15) },
      {
        provide: FileSaver,
        useValue: { save: (_file: Blob, name: string) => savedFiles.push(name) },
      },
    ],
  });
  const navigateByUrl = vi.spyOn(TestBed.inject(Router), 'navigateByUrl').mockResolvedValue(true);
  const fixture = TestBed.createComponent(OfferList);
  fixture.detectChanges();
  return {
    fixture,
    element: fixture.nativeElement as HTMLElement,
    calls,
    savedFiles,
    navigateByUrl,
  };
}

function buttonNamed(root: ParentNode, label: string): HTMLButtonElement {
  return Array.from(root.querySelectorAll('button')).find(
    (button) => button.textContent?.trim() === label,
  ) as HTMLButtonElement;
}

async function settle(fixture: ReturnType<typeof createPage>['fixture']): Promise<void> {
  await fixture.whenStable();
  fixture.detectChanges();
}

describe('OfferList', () => {
  it('shows the header with its two actions, the stat cards, the toolbar, the table and the paging', () => {
    const { element } = createPage();

    expect(element.querySelector('h1')?.textContent?.trim()).toBe('العروض الترويجية');
    expect(element.textContent).toContain('إدارة ومتابعة العروض التابعة للشركات و المتاجر.');
    expect(element.querySelector('app-page-header app-add-button')?.textContent).toContain(
      'إضافة عرض جديد',
    );
    expect(element.querySelector('app-page-header app-export-button')).toBeTruthy();
    expect(
      Array.from(element.querySelectorAll('app-stat-card'), (card) =>
        card.querySelector('[data-role="value"]')?.textContent?.trim(),
      ),
    ).toEqual(['34', '16', '14', '23']);
    expect(element.querySelector('app-offer-toolbar')).toBeTruthy();
    expect(element.querySelectorAll('app-offer-table tbody tr')).toHaveLength(2);
    expect(element.textContent).toContain('من 3000 عرض');
  });

  it('shows only the header and the "add your first offer" message when there are no offers', () => {
    const { element, navigateByUrl } = createPage({
      getOffers: () => of({ items: [], totalCount: 0 }),
    });

    expect(element.querySelector('h2')?.textContent?.trim()).toBe('لا توجد عروض مضافة حتى الآن');
    expect(element.textContent).toContain('أضف أول عرض إلى المنصة.');
    expect(element.querySelector('app-page-header app-add-button')).toBeNull();
    expect(element.querySelector('app-export-button')).toBeNull();
    expect(element.querySelector('app-stat-card')).toBeNull();
    expect(element.querySelector('app-offer-table')).toBeNull();

    buttonNamed(element, 'إضافة عرض جديد').click();
    expect(navigateByUrl).toHaveBeenCalledWith('/offers/new');
  });

  it('goes to the add page from the header button', () => {
    const { element, navigateByUrl } = createPage();

    buttonNamed(element.querySelector('app-page-header') as HTMLElement, 'إضافة عرض جديد').click();

    expect(navigateByUrl).toHaveBeenCalledWith('/offers/new');
  });

  it('deletes an offer once the dialog is confirmed', async () => {
    const { fixture, element, calls } = createPage();

    (element.querySelector('tbody tr app-row-actions-menu button') as HTMLButtonElement).click();
    fixture.detectChanges();
    buttonNamed(document, 'حذف').click();
    fixture.detectChanges();
    expect(element.querySelector('app-confirm-action-dialog')?.textContent).toContain(
      'خصم 30% على جميع الأزياء الشتوية',
    );

    buttonNamed(
      element.querySelector('app-confirm-action-dialog') as HTMLElement,
      'حذف العرض',
    ).click();
    await settle(fixture);

    expect(calls).toEqual(['delete offer-1']);
    expect(element.querySelector('app-confirm-action-dialog')).toBeNull();
  });

  it('saves the export under a dated file name', async () => {
    const { fixture, element, savedFiles } = createPage();

    buttonNamed(element, 'تصدير').click();
    await settle(fixture);

    expect(savedFiles).toEqual(['offers-2026-09-15.csv']);
  });

  it('opens an offer in the drawer and closes it once the offer is paused', async () => {
    const { fixture, element, calls } = createPage();

    (element.querySelector('button[data-role="open-offer"]') as HTMLButtonElement).click();
    fixture.detectChanges();
    const drawer = element.querySelector('app-offer-detail-drawer') as HTMLElement;
    expect(drawer.textContent).toContain('ألبسة الجمال');

    buttonNamed(drawer, 'إيقاف العرض').click();
    await settle(fixture);

    expect(calls).toEqual(['pause offer-2']);
    expect(element.querySelector('app-offer-detail-drawer')).toBeNull();
  });

  it('goes to the edit page of the open offer', () => {
    const { fixture, element, navigateByUrl } = createPage();

    (element.querySelector('button[data-role="open-offer"]') as HTMLButtonElement).click();
    fixture.detectChanges();
    buttonNamed(
      element.querySelector('app-offer-detail-drawer') as HTMLElement,
      'تعديل العرض',
    ).click();

    expect(navigateByUrl).toHaveBeenCalledWith('/offers/offer-2/edit');
  });

  it('deletes the open offer from the drawer and closes it', async () => {
    const { fixture, element, calls } = createPage();

    (element.querySelector('button[data-role="open-offer"]') as HTMLButtonElement).click();
    fixture.detectChanges();
    buttonNamed(
      element.querySelector('app-offer-detail-drawer footer') as HTMLElement,
      'حذف',
    ).click();
    fixture.detectChanges();
    buttonNamed(
      element.querySelector('app-confirm-action-dialog') as HTMLElement,
      'حذف العرض',
    ).click();
    await settle(fixture);

    expect(calls).toEqual(['delete offer-2']);
    expect(element.querySelector('app-offer-detail-drawer')).toBeNull();
  });
});
