import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router, provideRouter } from '@angular/router';
import { CLOCK } from '../../../../core/config/clock';
import { ConfirmActionDialog } from '../../../../shared/ui/confirm-action-dialog/confirm-action-dialog';
import { MerchantOfferRepository } from '../../data/merchant-offer.repository';
import { buildMerchantOffer } from '../../testing/merchant-offer-fixture';
import { FakeMerchantOfferRepository } from '../../testing/fake-merchant-offer-repository';
import { MerchantOfferDrawer } from '../../ui/merchant-offer-drawer/merchant-offer-drawer';
import { MerchantOfferTable } from '../../ui/merchant-offer-table/merchant-offer-table';
import { MerchantOffersPage } from './merchant-offers-page';

const NOW = new Date('2026-09-10T12:00:00.000Z');
const AUTUMN = buildMerchantOffer({ id: '1', title: 'خصم الخريف' });
const WINTER = buildMerchantOffer({ id: '2', title: 'خصم الشتاء', status: 'expired' });

function build(configure: (repository: FakeMerchantOfferRepository) => void = () => undefined) {
  const repository = new FakeMerchantOfferRepository();
  repository.catalog = { ...repository.catalog, items: [AUTUMN, WINTER] };
  configure(repository);
  TestBed.configureTestingModule({
    providers: [
      provideRouter([]),
      { provide: MerchantOfferRepository, useValue: repository },
      { provide: CLOCK, useValue: () => NOW },
    ],
  });
  const fixture = TestBed.createComponent(MerchantOffersPage);
  fixture.detectChanges();
  const router = TestBed.inject(Router);
  const navigate = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
  return { fixture, host: fixture.nativeElement as HTMLElement, repository, navigate };
}

function table(fixture: ReturnType<typeof build>['fixture']): MerchantOfferTable {
  return fixture.debugElement.query(By.directive(MerchantOfferTable))
    .componentInstance as MerchantOfferTable;
}

describe('MerchantOffersPage', () => {
  it('heads the page, then the quota cards, the toolbar and the table, in that order', () => {
    const { host } = build();

    expect(host.querySelector('h1')?.textContent?.trim()).toBe('العروض');
    expect(host.querySelector('app-page-header p')?.textContent?.trim()).toBe(
      'إدارة العروض الترويجية لمتجرك .',
    );
    expect([...host.children].map((child) => child.tagName.toLowerCase())).toEqual([
      'app-page-header',
      'div',
      'app-merchant-offer-toolbar',
      'app-merchant-offer-table',
    ]);
    expect(
      [...host.querySelector('[data-role="quota-grid"]')!.children].map((child) =>
        child.tagName.toLowerCase(),
      ),
    ).toEqual(['app-plan-usage-card', 'app-count-tiles']);
    expect(host.querySelector('app-plan-usage-card [data-role="title"]')?.textContent?.trim()).toBe(
      'العروض المستخدمة',
    );
  });

  it('opens the add page from "إضافة عرض جديد"', () => {
    const { host, navigate } = build();
    const add = [...host.querySelectorAll('button')].find(
      (button) => button.textContent?.trim() === 'إضافة عرض جديد',
    ) as HTMLButtonElement;

    add.click();

    expect(navigate).toHaveBeenCalledWith('/merchant/offers/new');
  });

  it('turns "إضافة عرض جديد" off once the plan has no live offers left', () => {
    const { host } = build((fake) => (fake.catalog = { ...fake.catalog, activeOfferLimit: 1 }));
    const add = [...host.querySelectorAll('button')].find(
      (button) => button.textContent?.trim() === 'إضافة عرض جديد',
    ) as HTMLButtonElement;

    expect(add.disabled).toBe(true);
  });

  it('opens the edit page from the row menu', () => {
    const { fixture, navigate } = build();

    table(fixture).edit.emit(AUTUMN);

    expect(navigate).toHaveBeenCalledWith('/merchant/offers/1/edit');
  });

  it('opens the drawer on a row, pauses from it and edits from it', async () => {
    const { fixture, repository, navigate } = build();
    table(fixture).view.emit(AUTUMN);
    fixture.detectChanges();
    const drawer = () =>
      fixture.debugElement.query(By.directive(MerchantOfferDrawer))?.componentInstance as
        MerchantOfferDrawer | undefined;

    expect(drawer()?.detail().offer.id).toBe('1');
    drawer()!.pause.emit();
    await fixture.whenStable();
    expect(repository.paused).toEqual(['1']);

    drawer()!.edit.emit();
    expect(navigate).toHaveBeenCalledWith('/merchant/offers/1/edit');

    drawer()!.closed.emit();
    fixture.detectChanges();
    expect(drawer()).toBeUndefined();
  });

  it('asks before deleting from the drawer, above it', async () => {
    const { fixture, repository } = build();
    table(fixture).view.emit(AUTUMN);
    fixture.detectChanges();
    (
      fixture.debugElement.query(By.directive(MerchantOfferDrawer))
        .componentInstance as MerchantOfferDrawer
    ).remove.emit();
    fixture.detectChanges();

    const dialog = fixture.debugElement.query(By.directive(ConfirmActionDialog))
      .componentInstance as ConfirmActionDialog;
    dialog.confirmed.emit();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(repository.deleted).toEqual(['1']);
    expect(fixture.debugElement.query(By.directive(MerchantOfferDrawer))).toBeNull();
    expect(
      table(fixture)
        .rows()
        .map((row) => row.offer.id),
    ).toEqual(['2']);
  });

  it('shows the load error with a retry', () => {
    const { host } = build((fake) => (fake.failure = new Error('انقطع الاتصال')));

    expect(host.textContent).toContain('انقطع الاتصال');
    expect(host.querySelector('app-merchant-offer-table')).toBeNull();
  });
});
