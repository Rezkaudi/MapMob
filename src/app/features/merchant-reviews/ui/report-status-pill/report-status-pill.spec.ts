import { TestBed } from '@angular/core/testing';
import { OwnerReviewReportStatus } from '../../models/owner-review-report-status';
import { ReportStatusPill } from './report-status-pill';

function render(status: OwnerReviewReportStatus): HTMLElement {
  const fixture = TestBed.createComponent(ReportStatusPill);
  fixture.componentRef.setInput('status', status);
  fixture.detectChanges();
  return fixture.nativeElement.querySelector('span');
}

describe('ReportStatusPill', () => {
  it('shows an unreported review in green and a waiting report in amber', () => {
    const unreported = render('none');
    const waiting = render('pending');

    expect(unreported.textContent?.trim()).toBe('غير مبلغ عنه');
    expect(unreported.className).toContain('bg-status-success');
    expect(waiting.textContent?.trim()).toBe('مبلغ عنه (قيد المراجعة)');
    expect(waiting.className).toContain('bg-accent');
  });

  it('shows how a settled report ended', () => {
    expect(render('accepted').textContent?.trim()).toBe('مخفية بعد البلاغ');
    expect(render('rejected').className).toContain('bg-closed');
  });
});
