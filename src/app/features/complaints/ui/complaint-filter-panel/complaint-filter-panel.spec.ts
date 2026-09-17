import { TestBed } from '@angular/core/testing';
import { ComplaintFilters, NO_COMPLAINT_FILTERS } from '../../models/complaint-filters';
import { ComplaintFilterPanel } from './complaint-filter-panel';

function render(filters: ComplaintFilters = NO_COMPLAINT_FILTERS) {
  const fixture = TestBed.createComponent(ComplaintFilterPanel);
  fixture.componentRef.setInput('filters', filters);
  fixture.detectChanges();
  const applied: ComplaintFilters[] = [];
  fixture.componentInstance.applied.subscribe((value) => applied.push(value));
  return { fixture, element: fixture.nativeElement as HTMLElement, applied };
}

function buttonNamed(root: ParentNode, label: string): HTMLButtonElement {
  return Array.from(root.querySelectorAll('button')).find(
    (button) => button.textContent?.trim() === label,
  ) as HTMLButtonElement;
}

describe('ComplaintFilterPanel', () => {
  it('titles the popover for complaints and lists the statuses right to left', () => {
    const { element } = render();

    expect(element.querySelector('h2')?.textContent?.trim()).toBe('تصفية البلاغات');
    const chips = Array.from(
      element.querySelectorAll('[role="radiogroup"][aria-label="الحالة"] [role="radio"]'),
      (chip) => chip.textContent?.trim(),
    );
    expect(chips).toEqual(['الكل', 'جديد', 'قيد المراجعة', 'تم الحل', 'مرفوض']);
  });

  it('applies the picked status and period', () => {
    const { fixture, element, applied } = render();

    buttonNamed(element, 'قيد المراجعة').click();
    buttonNamed(element, 'آخر 30 يوم').click();
    fixture.detectChanges();
    buttonNamed(element, 'تطبيق الفلاتر').click();

    expect(applied).toEqual([
      { ...NO_COMPLAINT_FILTERS, status: 'inReview', reportPeriod: 'last30Days' },
    ]);
  });

  it('shows the date fields for a custom range and blocks a backwards range', () => {
    const { fixture, element } = render({
      ...NO_COMPLAINT_FILTERS,
      reportPeriod: 'custom',
      customRange: { from: '2026-09-02', to: '2026-08-01' },
    });
    fixture.detectChanges();

    expect(element.querySelector('app-date-range-fields')).toBeTruthy();
    expect(buttonNamed(element, 'تطبيق الفلاتر').disabled).toBe(true);
  });

  it('resets every group to "الكل" and applies at once', () => {
    const { element, applied } = render({ ...NO_COMPLAINT_FILTERS, status: 'resolved' });

    buttonNamed(element, 'إعادة ضبط').click();

    expect(applied).toEqual([NO_COMPLAINT_FILTERS]);
  });
});
