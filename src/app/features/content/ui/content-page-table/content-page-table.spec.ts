import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ContentPage } from '../../models/content-page';
import { buildContentPage } from '../../testing/content-fixture';
import { ContentPageTable } from './content-page-table';

const PAGES = [buildContentPage(), buildContentPage({ kind: 'faq', title: 'الأسئلة الشائعة' })];

function render(
  inputs: Partial<{
    pages: readonly ContentPage[];
    isLoading: boolean;
    hasNoResults: boolean;
  }> = {},
) {
  TestBed.configureTestingModule({ providers: [provideRouter([])] });
  const fixture = TestBed.createComponent(ContentPageTable);
  fixture.componentRef.setInput('pages', inputs.pages ?? PAGES);
  fixture.componentRef.setInput('selectedIdSet', new Set(['faq']));
  fixture.componentRef.setInput('isLoading', inputs.isLoading ?? false);
  fixture.componentRef.setInput('hasNoResults', inputs.hasNoResults ?? false);
  fixture.detectChanges();
  return { fixture, element: fixture.nativeElement as HTMLElement };
}

function textsOf(root: ParentNode, selector: string): string[] {
  return Array.from(root.querySelectorAll(selector)).map((cell) => cell.textContent?.trim() ?? '');
}

describe('ContentPageTable', () => {
  it('draws the four headers after the select-all box', () => {
    const { element } = render();

    expect(textsOf(element, 'thead th').slice(1)).toEqual([
      'الصفحة',
      'آخر تحديث',
      'الحالة',
      'الإجراء',
    ]);
  });

  it('shows each page with its date, status and an edit link to its editor', () => {
    const { element } = render();
    const firstRow = element.querySelector('tbody tr') as HTMLElement;
    const cells = firstRow.querySelectorAll('td');

    expect(cells[1].textContent?.trim()).toBe('عن التطبيق');
    expect(cells[2].textContent?.trim()).toBe('26 يناير 2024');
    expect(cells[3].querySelector('app-content-status-pill')?.textContent?.trim()).toBe(
      'منشورة ومتاحة',
    );
    const edit = cells[4].querySelector('a') as HTMLAnchorElement;
    expect(edit.getAttribute('href')).toBe('/content/about');
    expect(edit.getAttribute('aria-label')).toBe('تعديل عن التطبيق');
  });

  it('ticks the selected pages and reports toggles', () => {
    const { fixture, element } = render();
    const toggled: string[] = [];
    let allToggles = 0;
    fixture.componentInstance.rowToggle.subscribe((kind) => toggled.push(kind));
    fixture.componentInstance.allToggle.subscribe(() => (allToggles += 1));
    const boxes = element.querySelectorAll<HTMLInputElement>('tbody input[type="checkbox"]');

    expect(Array.from(boxes).map((box) => box.checked)).toEqual([false, true]);
    boxes[0].click();
    element.querySelector<HTMLInputElement>('thead input[type="checkbox"]')?.click();

    expect(toggled).toEqual(['about']);
    expect(allToggles).toBe(1);
  });

  it('draws placeholder rows while loading', () => {
    const { element } = render({ isLoading: true });

    expect(element.querySelector('tbody[app-table-skeleton]')).toBeTruthy();
  });

  it('says when no page matches the search', () => {
    const { element } = render({ pages: [], hasNoResults: true });

    expect(element.querySelector('app-table-empty')?.textContent).toContain(
      'لا توجد صفحات مطابقة للبحث',
    );
  });
});

describe('ContentPageTable title', () => {
  it('links each title to its page editor', () => {
    const { element } = render();

    const titles = element.querySelectorAll<HTMLAnchorElement>('[data-role="open-page"]');

    expect(Array.from(titles, (title) => title.getAttribute('href'))).toEqual([
      '/content/about',
      '/content/faq',
    ]);
  });
});
