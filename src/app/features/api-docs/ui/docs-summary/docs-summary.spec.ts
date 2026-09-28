import { TestBed } from '@angular/core/testing';
import { DocsSummary } from './docs-summary';

describe('DocsSummary', () => {
  it('shows the endpoint, feature and table totals and the count per method', () => {
    const fixture = TestBed.createComponent(DocsSummary);
    fixture.componentRef.setInput('counts', {
      total: 135,
      byMethod: { GET: 68, POST: 25, PUT: 22, PATCH: 10, DELETE: 10 },
    });
    fixture.componentRef.setInput('featureCount', 17);
    fixture.componentRef.setInput('tableCount', 34);
    fixture.detectChanges();
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';

    for (const value of ['135', '17', '34', 'GET', '68', 'DELETE']) {
      expect(text).toContain(value);
    }
    expect(text).not.toMatch(/Ready|Not built/);
  });
});
