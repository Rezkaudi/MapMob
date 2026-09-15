import { TestBed } from '@angular/core/testing';
import { ReviewStatus } from '../../models/review-status';
import { ReviewStatusPill } from './review-status-pill';

function pillFor(status: ReviewStatus): HTMLElement {
  const fixture = TestBed.createComponent(ReviewStatusPill);
  fixture.componentRef.setInput('status', status);
  fixture.detectChanges();
  return fixture.nativeElement.querySelector('span');
}

describe('ReviewStatusPill', () => {
  it('words and colours each status as the table does', () => {
    expect(pillFor('published').textContent?.trim()).toBe('منشور');
    expect(pillFor('published').classList).toContain('bg-status-success');
    expect(pillFor('reported').textContent?.trim()).toBe('مبلغ عنه');
    expect(pillFor('reported').classList).toContain('bg-status-error');
    expect(pillFor('hidden').textContent?.trim()).toBe('مخفي');
    expect(pillFor('hidden').classList).toContain('bg-text-secondary');
  });
});
