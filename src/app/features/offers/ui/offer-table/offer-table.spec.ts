import { TestBed } from '@angular/core/testing';
import { Offer } from '../../models/offer';
import { buildOffer } from '../../testing/offer-fixture';
import { OfferTable } from './offer-table';

const WINTER = buildOffer();
const PAUSED = buildOffer({ id: 'offer-9', title: 'عرض متوقف', status: 'paused' });

interface RenderOptions {
  readonly entries?: readonly Offer[];
  readonly isLoading?: boolean;
  readonly hasNoResults?: boolean;
}

function render(options: RenderOptions = {}) {
  const fixture = TestBed.createComponent(OfferTable);
  fixture.componentRef.setInput('entries', options.entries ?? [WINTER, PAUSED]);
  fixture.componentRef.setInput('selectedIdSet', new Set(['offer-9']));
  fixture.componentRef.setInput('isLoading', options.isLoading ?? false);
  fixture.componentRef.setInput('hasNoResults', options.hasNoResults ?? false);
  fixture.componentRef.setInput('emptyMessage', 'لا توجد نتائج مطابقة للبحث أو الفلاتر');
  fixture.componentRef.setInput('rowCount', 4);
  fixture.detectChanges();
  return fixture;
}

function cellsOf(row: Element): string[] {
  return Array.from(row.querySelectorAll('td'), (cell) => cell.textContent?.trim() ?? '');
}

describe('OfferTable', () => {
  it('heads the columns in the design order', () => {
    const headers = Array.from(
      (render().nativeElement as HTMLElement).querySelectorAll('th'),
      (header) => header.textContent?.trim(),
    );

    expect(headers).toEqual([
      '',
      'العرض',
      'المكان',
      'التصنيف',
      'تاريخ البدء',
      'تاريخ الانتهاء',
      'الحالة',
      'الإجراء',
    ]);
  });

  it('fills a row with the offer, place, category, both days and status', () => {
    const [first, second] = Array.from(
      (render().nativeElement as HTMLElement).querySelectorAll('tbody tr'),
    );

    expect(cellsOf(first).slice(1, 7)).toEqual([
      'خصم 30% على جميع الأزياء الشتوية',
      'ألبسة الفاخر',
      'ألبسة',
      '١٢ يناير ٢٠٢٤',
      '٢٦ يناير ٢٠٢٤',
      'نشط',
    ]);
    expect(cellsOf(second)[6]).toBe('متوقف');
    expect((second.querySelector('input[type="checkbox"]') as HTMLInputElement).checked).toBe(true);
  });

  it('opens an offer from its title and from "عرض التفاصيل", and asks to delete from "حذف"', () => {
    const fixture = render();
    const view = vi.fn();
    const remove = vi.fn();
    fixture.componentInstance.view.subscribe(view);
    fixture.componentInstance.remove.subscribe(remove);
    const element = fixture.nativeElement as HTMLElement;
    const openMenuItems = () => {
      (element.querySelector('tbody tr app-row-actions-menu button') as HTMLButtonElement).click();
      fixture.detectChanges();
      return Array.from(
        document.querySelectorAll('[data-testid="action-menu-panel"] button'),
      ) as HTMLButtonElement[];
    };

    (element.querySelector('tbody tr button[data-role="open-offer"]') as HTMLButtonElement).click();
    const items = openMenuItems();
    expect(items.map((item) => item.textContent?.trim())).toEqual(['عرض التفاصيل', 'حذف']);
    items[0].click();
    fixture.detectChanges();
    openMenuItems()[1].click();

    expect(view.mock.calls).toEqual([[WINTER], [WINTER]]);
    expect(remove).toHaveBeenCalledWith(WINTER);
  });

  it('reports the ticks', () => {
    const fixture = render();
    const rowToggle = vi.fn();
    const allToggle = vi.fn();
    fixture.componentInstance.rowToggle.subscribe(rowToggle);
    fixture.componentInstance.allToggle.subscribe(allToggle);
    const element = fixture.nativeElement as HTMLElement;

    (element.querySelector('thead input') as HTMLInputElement).dispatchEvent(new Event('change'));
    (element.querySelector('tbody input') as HTMLInputElement).dispatchEvent(new Event('change'));

    expect(allToggle).toHaveBeenCalledOnce();
    expect(rowToggle).toHaveBeenCalledWith('offer-1');
  });

  it('shows skeleton rows while loading and the message when nothing matches', () => {
    const loading = render({ isLoading: true }).nativeElement as HTMLElement;
    const empty = render({ entries: [], hasNoResults: true }).nativeElement as HTMLElement;

    expect(loading.querySelector('tbody[app-table-skeleton]')).toBeTruthy();
    expect(empty.textContent).toContain('لا توجد نتائج مطابقة للبحث أو الفلاتر');
  });
});
