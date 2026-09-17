import { TestBed } from '@angular/core/testing';
import { NO_NOTIFICATION_FILTERS, NotificationFilters } from '../../models/notification-filters';
import { NotificationFilterPanel } from './notification-filter-panel';

function render(filters: NotificationFilters = NO_NOTIFICATION_FILTERS) {
  const fixture = TestBed.createComponent(NotificationFilterPanel);
  fixture.componentRef.setInput('filters', filters);
  fixture.detectChanges();
  return fixture;
}

function groupLabels(element: HTMLElement, groupName: string): string[] {
  const group = element.querySelector(`[role="radiogroup"][aria-label="${groupName}"]`)!;
  return Array.from(group.querySelectorAll('button'), (button) => button.textContent?.trim() ?? '');
}

function click(fixture: ReturnType<typeof render>, root: ParentNode, label: string): void {
  (
    Array.from(root.querySelectorAll('button')).find(
      (button) => button.textContent?.trim() === label,
    ) as HTMLButtonElement
  ).click();
  fixture.detectChanges();
}

describe('NotificationFilterPanel', () => {
  it('shows the heading, the three chip groups and the send period', () => {
    const element = render().nativeElement as HTMLElement;

    expect(element.textContent).toContain('تصفية الإشعارات');
    expect(groupLabels(element, 'الفئة المستهدفة')).toEqual([
      'الكل',
      'المستخدمون',
      'الشركات و المتاجر',
    ]);
    expect(groupLabels(element, 'نوع الإشعار')).toEqual(['الكل', 'عام', 'خاص']);
    expect(groupLabels(element, 'الحالة')).toEqual(['الكل', 'مرسل', 'مجدول', 'مسودة']);
    expect(element.textContent).toContain('تاريخ الإرسال');
    expect(element.textContent).toContain('نطاق مخصص');
  });

  it('applies only when asked, with everything picked in the panel', () => {
    const fixture = render();
    const applied = vi.fn();
    fixture.componentInstance.applied.subscribe(applied);
    const element = fixture.nativeElement as HTMLElement;

    click(fixture, element.querySelector('[aria-label="الفئة المستهدفة"]')!, 'المستخدمون');
    click(fixture, element.querySelector('[aria-label="نوع الإشعار"]')!, 'خاص');
    click(fixture, element.querySelector('[aria-label="الحالة"]')!, 'مجدول');
    click(fixture, element, 'آخر 7 أيام');
    expect(applied).not.toHaveBeenCalled();

    click(fixture, element, 'تطبيق الفلاتر');

    expect(applied).toHaveBeenCalledWith({
      audience: 'users',
      kind: 'private',
      status: 'scheduled',
      sendPeriod: 'last7Days',
      customRange: { from: null, to: null },
    });
  });

  it('will not apply a custom range that ends before it starts', () => {
    const fixture = render({
      ...NO_NOTIFICATION_FILTERS,
      sendPeriod: 'custom',
      customRange: { from: '2026-09-10', to: '2026-09-01' },
    });

    const apply = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll('button'),
    ).find((button) => button.textContent?.trim() === 'تطبيق الفلاتر') as HTMLButtonElement;
    expect(apply.disabled).toBe(true);
  });

  it('resets to "الكل" and applies that straight away', () => {
    const fixture = render({ ...NO_NOTIFICATION_FILTERS, status: 'sent' });
    const applied = vi.fn();
    fixture.componentInstance.applied.subscribe(applied);

    click(fixture, fixture.nativeElement, 'إعادة ضبط');

    expect(applied).toHaveBeenCalledWith(NO_NOTIFICATION_FILTERS);
  });
});
