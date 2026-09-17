import { TestBed } from '@angular/core/testing';
import { NotificationRow, buildNotificationRow } from '../../state/notification-row';
import { buildNotification } from '../../testing/notification-fixture';
import { NotificationTable } from './notification-table';

const SENT = buildNotificationRow(
  buildNotification({ id: 'n1', title: 'عرض جديد', status: 'sent', sendAt: '2024-01-26T10:00' }),
);
const DRAFT = buildNotificationRow(
  buildNotification({ id: 'n2', title: 'مسودة', status: 'draft', sendAt: null }),
);

interface RenderOptions {
  readonly rows?: readonly NotificationRow[];
  readonly isLoading?: boolean;
  readonly hasNoResults?: boolean;
}

function render(options: RenderOptions = {}) {
  const fixture = TestBed.createComponent(NotificationTable);
  fixture.componentRef.setInput('rows', options.rows ?? [SENT, DRAFT]);
  fixture.componentRef.setInput('selectedIdSet', new Set(['n2']));
  fixture.componentRef.setInput('isLoading', options.isLoading ?? false);
  fixture.componentRef.setInput('hasNoResults', options.hasNoResults ?? false);
  fixture.componentRef.setInput('emptyMessage', 'لا توجد نتائج مطابقة للبحث أو الفلاتر');
  fixture.detectChanges();
  return fixture;
}

function cellsOf(row: Element): string[] {
  return Array.from(row.querySelectorAll('td'), (cell) => cell.textContent?.trim() ?? '');
}

function openMenuItem(fixture: ReturnType<typeof render>, rowIndex: number, label: string): void {
  const row = fixture.nativeElement.querySelectorAll('tbody tr')[rowIndex] as HTMLElement;
  (row.querySelector('button[aria-haspopup]') as HTMLButtonElement).click();
  fixture.detectChanges();
  const item = Array.from(
    (fixture.nativeElement as HTMLElement).querySelectorAll(
      '[data-testid="action-menu-panel"] button',
    ),
  ).find((button) => button.textContent?.trim() === label) as HTMLButtonElement;
  item.click();
}

describe('NotificationTable', () => {
  it('heads the columns in the design order', () => {
    const headers = Array.from(
      (render().nativeElement as HTMLElement).querySelectorAll('th'),
      (header) => header.textContent?.trim(),
    );

    expect(headers).toEqual([
      '',
      'الاشعار',
      'الفئة المستهدفة',
      'نوع الإشعار',
      'المستلمون',
      'تاريخ الإرسال',
      'الحالة',
      'الإجراء',
    ]);
  });

  it('fills a row with the notification fields, and a dash for a draft with no time', () => {
    const [sent, draft] = Array.from(
      (render().nativeElement as HTMLElement).querySelectorAll('tbody tr'),
    );

    expect(cellsOf(sent).slice(1, 7)).toEqual([
      'عرض جديد',
      'المستخدمون',
      'عام',
      'جميع المستخدمين',
      '٢٦ يناير ٢٠٢٤',
      'مُرسل',
    ]);
    expect(cellsOf(draft)[5]).toBe('—');
  });

  it('marks the selected rows and reports ticks', () => {
    const fixture = render();
    const rowToggle = vi.fn();
    const allToggle = vi.fn();
    fixture.componentInstance.rowToggle.subscribe(rowToggle);
    fixture.componentInstance.allToggle.subscribe(allToggle);
    const element = fixture.nativeElement as HTMLElement;
    const checkboxes = element.querySelectorAll<HTMLInputElement>('tbody input[type="checkbox"]');

    expect(checkboxes[1].checked).toBe(true);
    checkboxes[0].dispatchEvent(new Event('change'));
    element.querySelector('thead input')!.dispatchEvent(new Event('change'));

    expect(rowToggle).toHaveBeenCalledWith('n1');
    expect(allToggle).toHaveBeenCalledOnce();
  });

  it('opens the details from the title and from every row menu item', () => {
    const fixture = render();
    const picks: string[] = [];
    fixture.componentInstance.view.subscribe((row) => picks.push(`view ${row.id}`));
    fixture.componentInstance.edit.subscribe((row) => picks.push(`edit ${row.id}`));
    fixture.componentInstance.duplicate.subscribe((row) => picks.push(`copy ${row.id}`));
    fixture.componentInstance.remove.subscribe((row) => picks.push(`delete ${row.id}`));

    (fixture.nativeElement.querySelector('[data-role="open-notification"]') as HTMLElement).click();
    openMenuItem(fixture, 0, 'عرض التفاصيل');
    openMenuItem(fixture, 0, 'تعديل');
    openMenuItem(fixture, 1, 'نسخ الإشعار');
    openMenuItem(fixture, 1, 'حذف');

    expect(picks).toEqual(['view n1', 'view n1', 'edit n1', 'copy n2', 'delete n2']);
  });

  it('shows skeleton rows while loading and the message when nothing matches', () => {
    const loading = render({ isLoading: true }).nativeElement as HTMLElement;
    const empty = render({ rows: [], hasNoResults: true }).nativeElement as HTMLElement;

    expect(loading.querySelector('tbody[app-table-skeleton]')).toBeTruthy();
    expect(empty.textContent).toContain('لا توجد نتائج مطابقة للبحث أو الفلاتر');
  });
});
