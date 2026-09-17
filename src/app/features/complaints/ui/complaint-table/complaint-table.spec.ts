import { TestBed } from '@angular/core/testing';
import { Complaint } from '../../models/complaint';
import { ComplaintRow, buildComplaintRow } from '../../state/complaint-row';
import { buildComplaintDetail } from '../../testing/complaint-fixture';
import { ComplaintTable } from './complaint-table';

const SHAM = buildComplaintRow(buildComplaintDetail());
const ZAWIYA = buildComplaintRow(
  buildComplaintDetail({ id: 'complaint-2', reference: '#1024', status: 'resolved' }),
);

interface RenderOptions {
  readonly rows?: readonly ComplaintRow[];
  readonly isLoading?: boolean;
  readonly hasNoResults?: boolean;
}

function render(options: RenderOptions = {}) {
  const fixture = TestBed.createComponent(ComplaintTable);
  fixture.componentRef.setInput('rows', options.rows ?? [SHAM, ZAWIYA]);
  fixture.componentRef.setInput('selectedIdSet', new Set(['complaint-2']));
  fixture.componentRef.setInput('isLoading', options.isLoading ?? false);
  fixture.componentRef.setInput('hasNoResults', options.hasNoResults ?? false);
  fixture.componentRef.setInput('emptyMessage', 'لا توجد نتائج مطابقة للبحث أو الفلاتر');
  fixture.detectChanges();
  return fixture;
}

function rowsOf(fixture: ReturnType<typeof render>): HTMLElement[] {
  return Array.from((fixture.nativeElement as HTMLElement).querySelectorAll('tbody tr'));
}

function textsOf(cell: Element): string[] {
  return Array.from(cell.querySelectorAll('[data-role]'), (part) => part.textContent?.trim() ?? '');
}

describe('ComplaintTable', () => {
  it('heads the columns in the design order, right to left', () => {
    const headers = Array.from(
      (render().nativeElement as HTMLElement).querySelectorAll('th'),
      (header) => header.textContent?.trim(),
    );

    expect(headers).toEqual([
      '',
      'رقم البلاغ',
      'المُّبلغ',
      'البلاغ على',
      'نوع البلاغ',
      'التاريخ',
      'الحالة',
      'الإجراء',
    ]);
  });

  it('fills a row with the reference, reporter, place, reason, date and status', () => {
    const cells = Array.from(rowsOf(render())[0].querySelectorAll('td'));

    expect(cells[1].textContent?.trim()).toBe('#1023');
    expect(cells[1].getAttribute('dir')).toBe('ltr');
    expect(textsOf(cells[2])).toEqual(['سارة علي', 'sara.r@example.com']);
    expect(cells[3].textContent?.trim()).toBe('مطعم الشام');
    expect(cells[4].textContent?.trim()).toBe('معلومات خاطئة');
    expect(cells[5].textContent?.trim()).toBe('٩ سبتمبر ٢٠٢٦');
    expect(cells[6].querySelector('app-complaint-status-pill')?.textContent?.trim()).toBe('جديد');
  });

  it('ticks the selected rows and reports toggles without opening the row', () => {
    const fixture = render();
    const opened: Complaint[] = [];
    const toggled: string[] = [];
    fixture.componentInstance.view.subscribe((complaint) => opened.push(complaint));
    fixture.componentInstance.rowToggle.subscribe((id) => toggled.push(id));
    const boxes = rowsOf(fixture).map(
      (row) => row.querySelector('input[type="checkbox"]') as HTMLInputElement,
    );

    expect(boxes.map((box) => box.checked)).toEqual([false, true]);
    boxes[0].click();

    expect(toggled).toEqual(['complaint-1']);
    expect(opened).toEqual([]);
  });

  it('opens a complaint from its row', () => {
    const fixture = render();
    const opened: Complaint[] = [];
    fixture.componentInstance.view.subscribe((complaint) => opened.push(complaint));

    rowsOf(fixture)[1].click();

    expect(opened).toEqual([ZAWIYA.complaint]);
  });

  it('offers details and delete from the row menu', () => {
    const fixture = render();
    const opened: Complaint[] = [];
    const removed: Complaint[] = [];
    fixture.componentInstance.view.subscribe((complaint) => opened.push(complaint));
    fixture.componentInstance.remove.subscribe((complaint) => removed.push(complaint));
    const trigger = rowsOf(fixture)[0].querySelector('button[aria-haspopup]') as HTMLButtonElement;

    trigger.click();
    fixture.detectChanges();
    const items = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll(
        '[data-testid="action-menu-panel"] button',
      ),
    ) as HTMLButtonElement[];

    expect(items.map((item) => item.textContent?.trim())).toEqual(['عرض التفاصيل', 'حذف']);
    items[1].click();
    expect(removed).toEqual([SHAM.complaint]);
    expect(opened).toEqual([]);
  });

  it('draws placeholder rows while loading, and the message when nothing matched', () => {
    const loading = render({ isLoading: true });
    expect(loading.nativeElement.querySelector('tbody[app-table-skeleton]')).toBeTruthy();

    const empty = render({ rows: [], hasNoResults: true });
    expect(empty.nativeElement.textContent).toContain('لا توجد نتائج مطابقة للبحث أو الفلاتر');
  });
});
