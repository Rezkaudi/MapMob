import { TestBed } from '@angular/core/testing';
import { ShareRow } from '../../models/share-row';
import { UsageMetricList } from './usage-metric-list';

const ROWS: readonly ShareRow[] = [
  {
    label: 'عمليات البحث والاستكشاف',
    valueText: '24,150',
    shareText: '(42%)',
    share: 42,
    tone: 'blue',
  },
  {
    label: 'مشاهدة تفاصيل الأماكن',
    valueText: '18,420',
    shareText: '(32%)',
    share: 32,
    tone: 'green',
  },
];

describe('UsageMetricList', () => {
  function render(isLoading = false): HTMLElement {
    const fixture = TestBed.createComponent(UsageMetricList);
    fixture.componentRef.setInput('rows', ROWS);
    fixture.componentRef.setInput('isLoading', isLoading);
    fixture.detectChanges();
    return fixture.nativeElement;
  }

  it('draws one item per metric with its label, count and share', () => {
    const items = Array.from(render().querySelectorAll('li'));

    expect(items.length).toBe(2);
    expect(items[0].querySelector('[data-role="label"]')?.textContent?.trim()).toBe(
      'عمليات البحث والاستكشاف',
    );
    expect(items[0].querySelector('[data-role="value"]')?.textContent?.trim()).toBe('24,150');
    expect(items[0].querySelector('[data-role="share"]')?.textContent?.trim()).toBe('(42%)');
  });

  it('fills each bar to the metric share in its tone', () => {
    const bars = Array.from(render().querySelectorAll('app-share-bar [data-role="share-fill"]'));

    expect((bars[1] as HTMLElement).style.width).toBe('32%');
    expect(bars[1].className).toContain('bg-status-success');
  });

  it('shows placeholders while loading', () => {
    const host = render(true);

    expect(host.querySelectorAll('app-skeleton').length).toBeGreaterThan(0);
    expect(host.querySelector('li')).toBeNull();
  });
});
