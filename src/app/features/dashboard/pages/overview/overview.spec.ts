import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { DashboardRepository } from '../../data/dashboard.repository';
import { Overview } from './overview';

const SUMMARY = {
  revenue: 23000,
  pendingReviewCount: 73,
  placeCount: 3000,
  newPlaceCount: 20,
  userCount: 173000,
  newUserCount: 320,
};

describe('Overview', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: DashboardRepository,
          useValue: {
            getSummary: () => of(SUMMARY),
            getActionItems: () => of([{ id: 'a', label: 'مراجعة', count: 12, tone: 'error' }]),
            getRecentPlaces: () => of([]),
            getRevenueSeries: () =>
              of({ name: 'الإيرادات', points: [{ label: 'Jan', value: 10 }] }),
            getGrowthSeries: () => of([{ name: 'الشركات', points: [{ label: 'Mon', value: 5 }] }]),
          },
        },
      ],
    });
  });

  it('renders the page title and the summary values', () => {
    const fixture = TestBed.createComponent(Overview);
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('نظرة عامة');
    expect(text).toContain('23000');
    expect(text).toContain('مراجعة');
  });

  it('draws the growth chart the way the design does', () => {
    const fixture = TestBed.createComponent(Overview);
    fixture.detectChanges();

    const component = fixture.componentInstance as unknown as {
      growthChart: () => {
        chart: { type: string };
        stroke: { curve: string };
        markers: { size: number };
        yaxis: { min: number };
      };
    };
    const chart = component.growthChart();

    expect(chart.chart.type).toBe('area');
    expect(chart.stroke.curve).toBe('straight');
    expect(chart.markers.size).toBeGreaterThan(0);
    expect(chart.yaxis.min).toBe(0);
  });
});
