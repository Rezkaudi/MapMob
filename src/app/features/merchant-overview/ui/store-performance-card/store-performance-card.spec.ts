import { TestBed } from '@angular/core/testing';
import { buildStorePerformanceChartOptions } from '../../state/store-performance-chart-options';
import { StorePerformanceCard } from './store-performance-card';

function render() {
  const fixture = TestBed.createComponent(StorePerformanceCard);
  fixture.componentRef.setInput('chartOptions', buildStorePerformanceChartOptions(null));
  fixture.componentRef.setInput('activePeriod', 'monthly');
  fixture.componentRef.setInput('isLoading', true);
  fixture.componentRef.setInput('dailyAverageText', '42 مشاهدة / يوم');
  fixture.componentRef.setInput('peakDayText', 'الخميس 23 يوليو (142 مشاهدة)');
  fixture.detectChanges();
  return { fixture, element: fixture.nativeElement as HTMLElement };
}

describe('StorePerformanceCard', () => {
  it('titles the chart and offers the three period tabs without a calendar', () => {
    const { element } = render();

    expect(element.textContent).toContain('أداء المتجر والمشاهدات');
    const tabs = [...element.querySelectorAll('button[aria-pressed]')].map((tab) =>
      tab.textContent!.trim(),
    );
    expect(tabs).toEqual(['اسبوعي', 'شهري', 'سنوي']);
    expect(element.querySelector('app-icon[name="calendar"]')).toBeNull();
  });

  it('puts the busiest day first in the footer, so RTL lands it on the right', () => {
    const { element } = render();

    const items = element.querySelectorAll('footer > div');
    expect(items[0].textContent).toContain('أعلى يوم تفاعل');
    expect(items[0].textContent).toContain('الخميس 23 يوليو (142 مشاهدة)');
    expect(items[1].textContent).toContain('متوسط المشاهدات اليومية');
    expect(items[1].textContent).toContain('42 مشاهدة / يوم');
  });

  it('writes each footer tile before its words', () => {
    const { element } = render();

    const first = element.querySelector('footer > div')!;
    expect(first.children[0].classList).toContain('bg-status-success');
  });

  it('asks for another period when a tab is pressed', () => {
    const { fixture, element } = render();
    const picked: string[] = [];
    fixture.componentInstance.periodChange.subscribe((period) => picked.push(period));

    [...element.querySelectorAll<HTMLButtonElement>('button[aria-pressed]')][0].click();

    expect(picked).toEqual(['weekly']);
  });
});
