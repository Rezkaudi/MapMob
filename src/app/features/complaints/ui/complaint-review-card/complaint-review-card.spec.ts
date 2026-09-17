import { TestBed } from '@angular/core/testing';
import { ComplaintStatus } from '../../models/complaint-status';
import { ComplaintReviewCard } from './complaint-review-card';

function render() {
  const fixture = TestBed.createComponent(ComplaintReviewCard);
  fixture.componentRef.setInput('status', 'new');
  fixture.componentRef.setInput('notes', 'ملاحظة');
  fixture.detectChanges();
  const statuses: ComplaintStatus[] = [];
  const notes: string[] = [];
  fixture.componentInstance.statusChange.subscribe((status) => statuses.push(status));
  fixture.componentInstance.notesChange.subscribe((value) => notes.push(value));
  return { element: fixture.nativeElement as HTMLElement, statuses, notes };
}

describe('ComplaintReviewCard', () => {
  it('offers the four statuses with the current one picked', () => {
    const { element } = render();
    const select = element.querySelector('select') as HTMLSelectElement;

    expect(Array.from(select.options, (option) => option.textContent?.trim())).toEqual([
      'جديد',
      'قيد المراجعة',
      'تم الحل',
      'مرفوض',
    ]);
    expect(select.value).toBe('new');
    expect(element.querySelector('label[for="complaint-status"]')?.textContent?.trim()).toBe(
      'اختيار الحالة الجديدة',
    );
  });

  it('reports a new status', () => {
    const { element, statuses } = render();
    const select = element.querySelector('select') as HTMLSelectElement;

    select.value = 'resolved';
    select.dispatchEvent(new Event('change'));

    expect(statuses).toEqual(['resolved']);
  });

  it('shows the notes and reports typing', () => {
    const { element, notes } = render();
    const textarea = element.querySelector('textarea') as HTMLTextAreaElement;

    expect(textarea.value).toBe('ملاحظة');
    expect(textarea.placeholder).toBe('اكتب ملاحظاتك');
    textarea.value = 'تم التحقق';
    textarea.dispatchEvent(new Event('input'));

    expect(notes).toEqual(['تم التحقق']);
  });
});
