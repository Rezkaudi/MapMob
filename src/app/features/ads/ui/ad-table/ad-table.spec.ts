import { TestBed } from '@angular/core/testing';
import { Ad } from '../../models/ad';
import { buildAd } from '../../testing/ad-fixture';
import { AdTable } from './ad-table';

const WINTER = buildAd();
const PLATFORM = buildAd({
  id: 'ad-9',
  advertiserType: 'admin',
  placeName: null,
  contentType: 'video',
  placement: 'searchResults',
  priority: 3,
  endsOn: null,
  status: 'paused',
});

function render(entries: readonly Ad[] = [WINTER, PLATFORM], isLoading = false) {
  const fixture = TestBed.createComponent(AdTable);
  fixture.componentRef.setInput('entries', entries);
  fixture.componentRef.setInput('selectedIdSet', new Set(['ad-9']));
  fixture.componentRef.setInput('isLoading', isLoading);
  fixture.componentRef.setInput('hasNoResults', entries.length === 0);
  fixture.componentRef.setInput('emptyMessage', 'لا توجد نتائج مطابقة للبحث أو الفلاتر');
  fixture.detectChanges();
  return fixture;
}

function cellsOf(row: Element): string[] {
  return Array.from(
    row.querySelectorAll('td'),
    (cell) => cell.textContent?.replace(/\s+/g, ' ').trim() ?? '',
  );
}

describe('AdTable', () => {
  it('heads the columns in the design order', () => {
    expect(
      Array.from((render().nativeElement as HTMLElement).querySelectorAll('th'), (header) =>
        header.textContent?.trim(),
      ),
    ).toEqual([
      '',
      'الإعلان',
      'المكان',
      'نوع المحتوى',
      'مكان الظهور',
      'مدة الإعلان',
      'الاولوية',
      'الحالة',
      'الإجراء',
    ]);
  });

  it('fills a row with the ad, store, content, page, period, priority and status', () => {
    const [first, second] = Array.from(
      (render().nativeElement as HTMLElement).querySelectorAll('tbody tr'),
    );

    expect(cellsOf(first).slice(1, 8)).toEqual([
      'خصم 30% على جميع الأزياء الشتوية',
      'ألبسة الفاخر',
      'صورة',
      'الصفحة الرئيسية',
      '١٢ يناير ٢٠٢٤ حتى ٢٦ يناير ٢٠٢٤',
      '5',
      'نشط',
    ]);
    expect(cellsOf(second).slice(2, 8)).toEqual([
      'إدارة التطبيق',
      'فيديو',
      'نتائج البحث',
      'من ١٢ يناير ٢٠٢٤ (دائم)',
      '3',
      'متوقف',
    ]);
    expect((second.querySelector('input') as HTMLInputElement).checked).toBe(true);
  });

  it('opens, edits, changes the status of and deletes the ad from its row', () => {
    const fixture = render();
    const view = vi.fn();
    const edit = vi.fn();
    const statusChange = vi.fn();
    const remove = vi.fn();
    fixture.componentInstance.view.subscribe(view);
    fixture.componentInstance.edit.subscribe(edit);
    fixture.componentInstance.statusChange.subscribe(statusChange);
    fixture.componentInstance.remove.subscribe(remove);
    const element = fixture.nativeElement as HTMLElement;
    const openMenuItems = () => {
      (element.querySelector('tbody tr app-row-actions-menu button') as HTMLButtonElement).click();
      fixture.detectChanges();
      return Array.from(
        document.querySelectorAll('[data-testid="action-menu-panel"] button'),
      ) as HTMLButtonElement[];
    };

    (element.querySelector('button[data-role="open-ad"]') as HTMLButtonElement).click();
    const items = openMenuItems();
    expect(items.map((item) => item.textContent?.trim())).toEqual([
      'عرض التفاصيل',
      'تعديل',
      'تغيير الحالة',
      'حذف',
    ]);
    items[0].click();
    fixture.detectChanges();
    openMenuItems()[1].click();
    fixture.detectChanges();
    openMenuItems()[2].click();
    fixture.detectChanges();
    openMenuItems()[3].click();

    expect(view.mock.calls).toEqual([[WINTER], [WINTER]]);
    expect(edit).toHaveBeenCalledWith(WINTER);
    expect(statusChange).toHaveBeenCalledWith(WINTER);
    expect(remove).toHaveBeenCalledWith(WINTER);
  });

  it('drops "تغيير الحالة" from an ad whose days are over', () => {
    const fixture = render([buildAd({ status: 'expired' })]);
    (
      fixture.nativeElement.querySelector(
        'tbody tr app-row-actions-menu button',
      ) as HTMLButtonElement
    ).click();
    fixture.detectChanges();

    expect(
      Array.from(document.querySelectorAll('[data-testid="action-menu-panel"] button'), (item) =>
        item.textContent?.trim(),
      ),
    ).toEqual(['عرض التفاصيل', 'تعديل', 'حذف']);
  });

  it('draws placeholder rows while loading and the message when nothing matches', () => {
    expect(render([], true).nativeElement.querySelector('tbody[app-table-skeleton]')).toBeTruthy();
    expect(render([]).nativeElement.textContent).toContain('لا توجد نتائج مطابقة للبحث أو الفلاتر');
  });
});
