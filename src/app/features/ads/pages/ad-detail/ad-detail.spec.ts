import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { CLOCK } from '../../../../core/config/clock';
import { AdRepository } from '../../data/ad.repository';
import { buildAd, buildAdDetail } from '../../testing/ad-fixture';
import { AdDetailPage } from './ad-detail';

const DETAIL = buildAdDetail({
  ad: buildAd({
    id: 'ad-1',
    title: 'افتتاح الفرع الجديد لمطعم المنارة',
    placeName: 'مطعم المنارة',
    status: 'active',
    startsOn: '2026-01-26',
    endsOn: '2026-02-26',
  }),
  placeId: 'place-1',
  text: 'استفد من أقوى العروض الحصرية لموسم الشتاء.',
  createdOn: '2026-01-15',
  updatedOn: '2026-01-20',
  updatedBy: 'Admin',
});

function createPage(overrides: Partial<AdRepository> = {}) {
  const paused: string[] = [];
  const deleted: string[] = [];
  const repository: Partial<AdRepository> = {
    getAdDetail: () => of(DETAIL),
    // A save refreshes the shared list store, so the page needs those two as well.
    getAds: () => of({ items: [DETAIL.ad], totalCount: 1 }),
    getSummary: () => of({ totalCount: 1, activeCount: 1, scheduledCount: 0, endedCount: 0 }),
    pauseAd: (id) => {
      paused.push(id);
      return of(buildAd({ id, status: 'paused' }));
    },
    deleteAd: (id) => {
      deleted.push(id);
      return of(undefined) as Observable<void>;
    },
    ...overrides,
  };
  TestBed.configureTestingModule({
    providers: [
      provideRouter([]),
      { provide: AdRepository, useValue: repository },
      { provide: CLOCK, useValue: () => new Date(2026, 0, 30) },
    ],
  });
  const navigateByUrl = vi.spyOn(TestBed.inject(Router), 'navigateByUrl').mockResolvedValue(true);
  const fixture = TestBed.createComponent(AdDetailPage);
  fixture.componentRef.setInput('id', 'ad-1');
  fixture.detectChanges();
  return {
    fixture,
    element: fixture.nativeElement as HTMLElement,
    paused,
    deleted,
    navigateByUrl,
  };
}

function buttonNamed(root: ParentNode, label: string): HTMLButtonElement {
  return Array.from(root.querySelectorAll('button')).find(
    (button) => button.textContent?.trim() === label,
  ) as HTMLButtonElement;
}

describe('AdDetailPage', () => {
  it('heads the page with the breadcrumb, the title and the description', () => {
    const { element } = createPage();

    expect(element.querySelector('nav')?.textContent).toContain('الإعلانات');
    expect(element.querySelector('h1')?.textContent?.trim()).toBe('تفاصيل الإعلان');
    expect(element.textContent).toContain(
      'عرض جميع تفاصيل الإعلان و حالته وفترة ظهوره و أداه الإحصائي',
    );
  });

  it('shows the ad, its status and where it runs in the overview card', () => {
    const { element } = createPage();
    const card = element.querySelector('app-ad-overview-card') as HTMLElement;

    expect(card.querySelector('h2')?.textContent?.trim()).toBe('افتتاح الفرع الجديد لمطعم المنارة');
    expect(card.textContent).toContain('نشط');
    expect(card.textContent).toContain('تاريخ الإنشاء: 15 يناير 2026');
    expect(card.textContent).toContain('مطعم المنارة');
    expect(card.textContent).toContain('الصفحة الرئيسية (البانر الرئيسي العلوي)');
  });

  it('lists the saved data, the schedule and the four counts', () => {
    const { element } = createPage();

    const headings = Array.from(element.querySelectorAll('app-ad-detail-card h2')).map((heading) =>
      heading.textContent?.trim(),
    );
    expect(headings).toEqual([
      'بيانات ومعلومات الإعلان',
      'فترة الظهور والجدولة',
      'إحصائيات الأداء والتفاعل',
    ]);

    const info = element.querySelector('app-ad-info-card') as HTMLElement;
    expect(info.textContent).toContain('الصفحة الرئيسية - البانر الرئيسي العلوي');
    expect(info.textContent).toContain('أعلى أولوية ( 5)');
    expect(info.textContent).toContain('Admin - 20 يناير 2026');
    expect(info.querySelector('a')?.getAttribute('href')).toBe('/admin/places/place-1');

    const schedule = element.querySelector('app-ad-schedule-period-card') as HTMLElement;
    expect(schedule.textContent).toContain('26 يناير 2026');
    expect(schedule.textContent).toContain('26 فبراير 2026');

    const metrics = element.querySelector('app-ad-metrics-card') as HTMLElement;
    expect(metrics.textContent).toContain('48,250');
    expect(metrics.textContent).toContain('3,860');
    expect(metrics.textContent).toContain('8.00%');
    expect(metrics.textContent).toContain('34,120');
  });

  it('opens the edit form from the overview card', () => {
    const { element, navigateByUrl } = createPage();

    buttonNamed(element, 'تعديل الإعلان').click();

    expect(navigateByUrl).toHaveBeenCalledWith('/admin/ads/ad-1/edit');
  });

  it('stops the ad after confirming, then reloads it', async () => {
    const { fixture, element, paused } = createPage();

    buttonNamed(element, 'إيقاف الإعلان').click();
    fixture.detectChanges();
    const dialog = element.querySelector('app-confirm-action-dialog') as HTMLElement;
    expect(dialog.textContent).toContain('هل أنت متأكد من رغبتك في إيقاف هذا الإعلان؟');

    buttonNamed(dialog, 'إيقاف الإعلان').click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(paused).toEqual(['ad-1']);
    expect(element.querySelector('app-confirm-action-dialog')).toBeNull();
  });

  it('warns that deleting is final, then returns to the list', async () => {
    const { fixture, element, deleted, navigateByUrl } = createPage();

    buttonNamed(element, 'حذف').click();
    fixture.detectChanges();
    const dialog = element.querySelector('app-confirm-action-dialog') as HTMLElement;
    expect(dialog.textContent).toContain('تنبيه: إجراء نهائي لا يمكن التراجع عنه');

    buttonNamed(dialog, 'حذف الإعلان').click();
    await fixture.whenStable();

    expect(deleted).toEqual(['ad-1']);
    expect(navigateByUrl).toHaveBeenCalledWith('/admin/ads');
  });

  it('offers to try again when the ad cannot be loaded', () => {
    const { element } = createPage({ getAdDetail: () => throwError(() => new Error('تعذر')) });

    expect(element.querySelector('app-error-state')?.textContent).toContain('تعذر');
    expect(element.querySelector('app-ad-overview-card')).toBeNull();
  });
});
