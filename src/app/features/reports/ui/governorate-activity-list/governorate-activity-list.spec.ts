import { TestBed } from '@angular/core/testing';
import { ShareRow } from '../../models/share-row';
import { GovernorateActivityList } from './governorate-activity-list';

const ROWS: readonly ShareRow[] = [
  { label: 'دمشق', valueText: '16,750 زيارة', shareText: '(32%)', share: 32, tone: 'violet' },
];

describe('GovernorateActivityList', () => {
  function render(isLoading = false): HTMLElement {
    const fixture = TestBed.createComponent(GovernorateActivityList);
    fixture.componentRef.setInput('title', 'النشاط حسب الموقع الجغرافي');
    fixture.componentRef.setInput(
      'description',
      'توزيع التفاعل والزيارات حسب المحافظات الأكثر نشاطاً',
    );
    fixture.componentRef.setInput('rows', ROWS);
    fixture.componentRef.setInput('isLoading', isLoading);
    fixture.detectChanges();
    return fixture.nativeElement;
  }

  it('shows the title and the description', () => {
    const host = render();

    expect(host.querySelector('h2')?.textContent?.trim()).toBe('النشاط حسب الموقع الجغرافي');
    expect(host.querySelector('p')?.textContent?.trim()).toBe(
      'توزيع التفاعل والزيارات حسب المحافظات الأكثر نشاطاً',
    );
  });

  it('draws one row per governorate with its name, visits, share and bar', () => {
    const row = render().querySelector('li')!;

    expect(row.querySelector('[data-role="label"]')?.textContent?.trim()).toBe('دمشق');
    expect(row.querySelector('[data-role="value"]')?.textContent?.trim()).toBe('16,750 زيارة');
    expect(row.querySelector('[data-role="share"]')?.textContent?.trim()).toBe('(32%)');
    expect((row.querySelector('[data-role="share-fill"]') as HTMLElement).style.width).toBe('32%');
  });

  it('keeps the title but swaps the rows for placeholders while loading', () => {
    const host = render(true);

    expect(host.querySelector('h2')).toBeTruthy();
    expect(host.querySelector('li')).toBeNull();
    expect(host.querySelectorAll('app-skeleton').length).toBeGreaterThan(0);
  });
});
