import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CampaignStatusPill } from '../../../../shared/ui/campaign-status-pill/campaign-status-pill';
import { RowActionsMenu } from '../../../../shared/ui/row-actions-menu/row-actions-menu';
import { MerchantOffer } from '../../models/merchant-offer';
import { toMerchantOfferRow } from '../../state/merchant-offer-rows';
import { buildMerchantOffer } from '../../testing/merchant-offer-fixture';
import { MerchantOfferTable } from './merchant-offer-table';

const AUTUMN = buildMerchantOffer({ id: '1', startsOn: '2024-01-12', endsOn: '2024-01-26' });
const WINTER = buildMerchantOffer({
  id: '2',
  title: 'خصم الشتاء',
  scope: 'allItems',
  itemIds: [],
  status: 'paused',
  imageUrl: 'https://cdn.example.com/winter.jpg',
});

function build(selected: string[] = []) {
  const fixture = TestBed.createComponent(MerchantOfferTable);
  fixture.componentRef.setInput('rows', [AUTUMN, WINTER].map(toMerchantOfferRow));
  fixture.componentRef.setInput('selectedIdSet', new Set(selected));
  fixture.detectChanges();
  return fixture;
}

function cellTexts(row: Element): string[] {
  return [...row.querySelectorAll('td')].map((cell) => cell.textContent?.trim() ?? '');
}

describe('MerchantOfferTable', () => {
  it('heads the columns right to left as the frame does', () => {
    const headers = [...build().nativeElement.querySelectorAll('th')].map((cell: Element) =>
      cell.textContent?.trim(),
    );

    expect(headers).toEqual([
      '',
      'العرض',
      'النطاق',
      'تاريخ البدء',
      'تاريخ الانتهاء',
      'الحالة',
      'الإجراء',
    ]);
  });

  it('prints each offer: tile and title, scope, both days and status', () => {
    const fixture = build();
    const rows = fixture.nativeElement.querySelectorAll('tbody tr');

    expect(rows[0].querySelector('[data-role="open-offer"]')?.textContent?.trim()).toBe(
      'خصم 30% على موسم الخريف',
    );
    expect(cellTexts(rows[0]).slice(2, 6)).toEqual([
      '3 منتجات',
      '١٢ يناير ٢٠٢٤',
      '٢٦ يناير ٢٠٢٤',
      'نشط',
    ]);
    expect(rows[0].querySelector('[data-role="offer-initial"]')?.textContent?.trim()).toBe('خ');
    expect(rows[1].querySelector('img')?.getAttribute('src')).toBe(
      'https://cdn.example.com/winter.jpg',
    );
    expect(cellTexts(rows[1])[2]).toBe('جميع المنتجات');
    const pills = fixture.debugElement.queryAll(By.directive(CampaignStatusPill));
    expect((pills[1].componentInstance as CampaignStatusPill).status()).toBe('paused');
  });

  it('writes the tile before the title so RTL puts it on the right', () => {
    const offerCell = build().nativeElement.querySelector('tbody tr td:nth-child(2) > div');

    expect(
      [...offerCell.children].map((child: Element) => child.getAttribute('data-role')),
    ).toEqual(['offer-initial', 'open-offer']);
  });

  it('reports ticks on one row and on the header box', () => {
    const fixture = build(['2']);
    const toggled: string[] = [];
    let allToggles = 0;
    fixture.componentInstance.rowToggle.subscribe((id) => toggled.push(id));
    fixture.componentInstance.allToggle.subscribe(() => (allToggles += 1));
    const boxes = fixture.nativeElement.querySelectorAll('input[type="checkbox"]');

    expect(boxes[2].checked).toBe(true);
    boxes[1].click();
    boxes[0].click();

    expect(toggled).toEqual(['1']);
    expect(allToggles).toBe(1);
  });

  it('opens the details from the title and from "عرض التفاصيل"', () => {
    const fixture = build();
    const viewed: MerchantOffer[] = [];
    fixture.componentInstance.view.subscribe((offer) => viewed.push(offer));

    fixture.nativeElement.querySelector('[data-role="open-offer"]').click();
    const menu = fixture.debugElement.queryAll(By.directive(RowActionsMenu))[1]
      .componentInstance as RowActionsMenu;
    menu.view.emit();

    expect(viewed).toEqual([AUTUMN, WINTER]);
  });

  it('offers view, edit and delete in the row menu, as the frame draws it', () => {
    const fixture = build();
    const edited: MerchantOffer[] = [];
    const removed: MerchantOffer[] = [];
    fixture.componentInstance.edit.subscribe((offer) => edited.push(offer));
    fixture.componentInstance.remove.subscribe((offer) => removed.push(offer));

    const menu = fixture.debugElement.query(By.directive(RowActionsMenu))
      .componentInstance as RowActionsMenu;
    expect(menu.primaryAction()).toBe('view');
    expect(menu.isEditVisible()).toBe(true);
    expect(menu.isStatusChangeVisible()).toBe(false);
    menu.edit.emit();
    menu.remove.emit();

    expect(edited).toEqual([AUTUMN]);
    expect(removed).toEqual([AUTUMN]);
  });

  it('shows the empty message in place of rows', () => {
    const fixture = TestBed.createComponent(MerchantOfferTable);
    fixture.componentRef.setInput('rows', []);
    fixture.componentRef.setInput('hasNoRows', true);
    fixture.componentRef.setInput('emptyMessage', 'لم تضف أي عرض بعد');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('لم تضف أي عرض بعد');
  });
});
