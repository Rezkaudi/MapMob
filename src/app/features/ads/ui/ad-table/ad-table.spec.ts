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

  it('edits from the title and from "تعديل", and asks to delete from "حذف"', () => {
    const fixture = render();
    const edit = vi.fn();
    const remove = vi.fn();
    fixture.componentInstance.edit.subscribe(edit);
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
    expect(items.map((item) => item.textContent?.trim())).toEqual(['تعديل', 'حذف']);
    items[0].click();
    fixture.detectChanges();
    openMenuItems()[1].click();

    expect(edit.mock.calls).toEqual([[WINTER], [WINTER]]);
    expect(remove).toHaveBeenCalledWith(WINTER);
  });

  it('draws placeholder rows while loading and the message when nothing matches', () => {
    expect(render([], true).nativeElement.querySelector('tbody[app-table-skeleton]')).toBeTruthy();
    expect(render([]).nativeElement.textContent).toContain('لا توجد نتائج مطابقة للبحث أو الفلاتر');
  });
});
