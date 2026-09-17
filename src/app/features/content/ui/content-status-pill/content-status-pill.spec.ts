import { TestBed } from '@angular/core/testing';
import { ContentPageStatus } from '../../models/content-page-status';
import { ContentStatusPill } from './content-status-pill';

function render(status: ContentPageStatus): HTMLElement {
  const fixture = TestBed.createComponent(ContentStatusPill);
  fixture.componentRef.setInput('status', status);
  fixture.detectChanges();
  return fixture.nativeElement.querySelector('span') as HTMLElement;
}

describe('ContentStatusPill', () => {
  it('shows a published page in green', () => {
    const pill = render('published');

    expect(pill.textContent?.trim()).toBe('منشورة ومتاحة');
    expect(pill.classList).toContain('bg-status-success');
  });

  it('shows a draft in amber', () => {
    const pill = render('draft');

    expect(pill.textContent?.trim()).toBe('مسودة');
    expect(pill.classList).toContain('bg-status-warning');
  });
});
