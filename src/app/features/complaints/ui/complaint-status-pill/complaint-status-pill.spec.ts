import { TestBed } from '@angular/core/testing';
import { ComplaintStatus } from '../../models/complaint-status';
import { ComplaintStatusPill } from './complaint-status-pill';

function renderPill(status: ComplaintStatus): HTMLElement {
  const fixture = TestBed.createComponent(ComplaintStatusPill);
  fixture.componentRef.setInput('status', status);
  fixture.detectChanges();
  return fixture.nativeElement.querySelector('span') as HTMLElement;
}

describe('ComplaintStatusPill', () => {
  it('names and colours each status as the design does', () => {
    const pills = (['new', 'inReview', 'rejected', 'resolved'] as const).map(renderPill);

    expect(pills.map((pill) => pill.textContent?.trim())).toEqual([
      'جديد',
      'قيد المراجعة',
      'مرفوض',
      'تم الحل',
    ]);
    expect(pills[0].classList).toContain('bg-primary');
    expect(pills[1].classList).toContain('bg-accent');
    expect(pills[2].classList).toContain('bg-closed');
    expect(pills[3].classList).toContain('bg-status-success');
  });
});
