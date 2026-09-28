import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { OfferValidityCard } from '../../../../shared/ui/offer-validity-card/offer-validity-card';
import { SideDrawer } from '../../../../shared/ui/side-drawer/side-drawer';
import { MerchantOfferDetail } from '../../models/merchant-offer-detail';
import { buildMerchantOffer } from '../../testing/merchant-offer-fixture';
import { MerchantOfferActions } from '../merchant-offer-actions/merchant-offer-actions';
import { MerchantOfferDrawer } from './merchant-offer-drawer';

const DETAIL: MerchantOfferDetail = {
  offer: buildMerchantOffer({
    title: 'خصم 30% على جميع الأزياء الشتوية',
    imageUrl: '/assets/images/offer-winter-clothes.jpg',
  }),
  scopeText: 'يشمل جميع المنتجات',
  pauseAction: 'pause',
};

function build() {
  const fixture = TestBed.createComponent(MerchantOfferDrawer);
  fixture.componentRef.setInput('detail', DETAIL);
  fixture.detectChanges();
  return fixture;
}

describe('MerchantOfferDrawer', () => {
  it('is the "تفاصيل العرض" drawer with the rose dot and the grey footer', () => {
    const drawer = build().debugElement.query(By.directive(SideDrawer))
      .componentInstance as SideDrawer;

    expect(drawer.title()).toBe('تفاصيل العرض');
    expect(drawer.hasAlertDot()).toBe(true);
    expect(drawer.footerTone()).toBe('muted');
  });

  it('shows the picture, title and description, then the scope, then the days', () => {
    const fixture = build();
    const host = fixture.nativeElement as HTMLElement;

    expect(host.querySelector('app-offer-summary-card img')?.getAttribute('src')).toBe(
      '/assets/images/offer-winter-clothes.jpg',
    );
    expect(host.querySelector('app-offer-summary-card h3')?.textContent?.trim()).toBe(
      'خصم 30% على جميع الأزياء الشتوية',
    );
    const scope = host.querySelector('[data-role="scope"]');
    expect(scope?.querySelector('strong')?.textContent?.trim()).toBe('النطاق:');
    expect(scope?.textContent?.replace(/\s+/g, ' ').trim()).toBe('النطاق: يشمل جميع المنتجات');
    const validity = fixture.debugElement.query(By.directive(OfferValidityCard))
      .componentInstance as OfferValidityCard;
    expect([validity.startsOn(), validity.endsOn()]).toEqual(['2026-09-01', '2026-09-15']);
  });

  it('passes the footer buttons on, and closes', () => {
    const fixture = build();
    const log: string[] = [];
    const drawer = fixture.componentInstance;
    drawer.edit.subscribe(() => log.push('edit'));
    drawer.pause.subscribe(() => log.push('pause'));
    drawer.remove.subscribe(() => log.push('remove'));
    drawer.closed.subscribe(() => log.push('close'));
    const actions = fixture.debugElement.query(By.directive(MerchantOfferActions))
      .componentInstance as MerchantOfferActions;

    expect(actions.pauseAction()).toBe('pause');
    actions.edit.emit();
    actions.pause.emit();
    actions.remove.emit();
    (
      fixture.nativeElement.querySelector('button[aria-label="إغلاق"]') as HTMLButtonElement
    ).click();

    expect(log).toEqual(['edit', 'pause', 'remove', 'close']);
  });
});
