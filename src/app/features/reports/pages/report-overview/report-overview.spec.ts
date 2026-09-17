import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { FileSaver } from '../../../../shared/files/file-saver';
import { ReportsRepository } from '../../data/reports.repository';
import { ReportOverview } from './report-overview';

type FakeReportsRepository = { [Method in keyof ReportsRepository]: ReportsRepository[Method] };

function fullRepository(overrides: Partial<ReportsRepository> = {}): FakeReportsRepository {
  return {
    getCategoryShares: () => of([{ categoryName: 'مطاعم', share: 29 }]),
    getGovernorateActivities: () => of([{ governorateName: 'دمشق', visitCount: 16750, share: 32 }]),
    getUsageMetrics: () => of([{ label: 'عمليات البحث والاستكشاف', count: 24150, share: 42 }]),
    getGrowthSeries: () => of([]),
    getRevenueSeries: () => of({ name: 'الإيرادات', points: [{ label: 'Jul', value: 48200 }] }),
    ...overrides,
  };
}

function createPage(repository: FakeReportsRepository = fullRepository()) {
  const savedFiles: string[] = [];
  const requestedUsagePeriods: string[] = [];
  const watchedRepository: FakeReportsRepository = {
    ...repository,
    getUsageMetrics: (period) => {
      requestedUsagePeriods.push(period);
      return repository.getUsageMetrics(period);
    },
  };
  TestBed.configureTestingModule({
    providers: [
      { provide: ReportsRepository, useValue: watchedRepository },
      {
        provide: FileSaver,
        useValue: { save: (_file: Blob, name: string) => savedFiles.push(name) },
      },
    ],
  });
  const fixture = TestBed.createComponent(ReportOverview);
  fixture.detectChanges();
  return {
    fixture,
    element: fixture.nativeElement as HTMLElement,
    savedFiles,
    requestedUsagePeriods,
  };
}

function chartPanelTitled(root: ParentNode, title: string): HTMLElement {
  return Array.from(root.querySelectorAll<HTMLElement>('app-chart-panel')).find(
    (panel) => panel.querySelector('h2')?.textContent?.trim() === title,
  )!;
}

describe('ReportOverview', () => {
  it('shows the header with the design copy and an export button', () => {
    const { element } = createPage();

    expect(element.querySelector('h1')?.textContent?.trim()).toBe('الاحصائيات و التقارير');
    expect(element.textContent).toContain(
      'نظرة عامة على أداء المنصة و نشاط المستخدمين والشركات و الايرادات التشغيلية',
    );
    expect(element.querySelector('app-page-header app-export-button')).toBeTruthy();
    expect(element.querySelector('app-page-header app-add-button')).toBeNull();
  });

  it('shows all five cards', () => {
    const { element } = createPage();

    expect(element.querySelector('app-category-share-chart')?.textContent).toContain(
      'الشركات والمتاجر حسب التصنيف',
    );
    expect(chartPanelTitled(element, 'نمو المستخدمين و التفاعل')).toBeTruthy();
    expect(chartPanelTitled(element, 'نشاط المستخدمين و سلوك الاستخدام')).toBeTruthy();
    expect(element.querySelector('app-governorate-activity-list')?.textContent).toContain(
      '16,750 زيارة',
    );
    expect(chartPanelTitled(element, 'الإيرادات')).toBeTruthy();
  });

  it('puts the tabs in the design order and marks the active one', () => {
    const { element } = createPage();
    const tabsOf = (title: string) =>
      Array.from(
        chartPanelTitled(element, title).querySelectorAll('button[aria-pressed]'),
        (tab) => [tab.textContent?.trim(), tab.getAttribute('aria-pressed')],
      );

    expect(tabsOf('نمو المستخدمين و التفاعل')).toEqual([
      ['اسبوعي', 'true'],
      ['شهري', 'false'],
      ['سنوي', 'false'],
    ]);
    expect(tabsOf('الإيرادات')).toEqual([
      ['يومي', 'false'],
      ['اسبوعي', 'false'],
      ['شهري', 'true'],
    ]);
  });

  it('reloads the usage card when one of its tabs is picked', () => {
    const { element, requestedUsagePeriods } = createPage();
    const yearlyTab = Array.from(
      chartPanelTitled(element, 'نشاط المستخدمين و سلوك الاستخدام').querySelectorAll('button'),
    ).find((tab) => tab.textContent?.trim() === 'سنوي')!;

    yearlyTab.click();

    expect(requestedUsagePeriods).toEqual(['weekly', 'yearly']);
  });

  it('saves the report as a CSV file when export is pressed', () => {
    const { element, savedFiles } = createPage();

    element.querySelector<HTMLButtonElement>('app-export-button button')!.click();

    expect(savedFiles).toEqual(['mapmob-reports.csv']);
  });

  it('shows the error with a retry in place of the cards when loading fails', () => {
    const { element } = createPage(
      fullRepository({
        getCategoryShares: () => throwError(() => new Error('تعذر تحميل التقارير')),
      }),
    );

    expect(element.querySelector('app-error-state')?.textContent).toContain('تعذر تحميل التقارير');
    expect(element.querySelector('app-chart-panel')).toBeNull();
  });
});
