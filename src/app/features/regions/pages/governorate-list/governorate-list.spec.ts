import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NEVER, Observable, of, throwError } from 'rxjs';
import { PagedResult } from '../../../../core/models/paged-result';
import { GovernorateRepository } from '../../data/governorate.repository';
import { Governorate } from '../../models/governorate';
import { buildGovernorate } from '../../testing/region-entry-fixture';
import { GovernorateList } from './governorate-list';

const TARTUS = buildGovernorate({ id: 'governorate-1', name: 'طرطوس' });

function render(repository: Partial<GovernorateRepository>) {
  TestBed.configureTestingModule({
    providers: [provideRouter([]), { provide: GovernorateRepository, useValue: repository }],
  });
  const fixture = TestBed.createComponent(GovernorateList);
  fixture.detectChanges();
  return fixture;
}

function pageOf(items: Governorate[]): () => Observable<PagedResult<Governorate>> {
  return () => of({ items, totalCount: items.length });
}

function buttonNamed(element: HTMLElement, label: string): HTMLButtonElement | undefined {
  return Array.from(element.querySelectorAll('button')).find(
    (button) => button.textContent?.trim() === label,
  );
}

describe('GovernorateList', () => {
  it('shows the page header, the toolbar and the governorate rows', () => {
    const element = render({ getGovernorates: pageOf([TARTUS]) }).nativeElement as HTMLElement;

    expect(element.querySelector('h1')?.textContent?.trim()).toBe('المحافظات والمناطق');
    expect(element.textContent).toContain(
      'إدارة المحافظات و المناطق المستخدمة في تحديد مواقع الأماكن',
    );
    expect((element.querySelector('input[type="search"]') as HTMLInputElement).placeholder).toBe(
      'ابحث عن محافظة...',
    );
    expect(element.textContent).toContain('عرض 1- 1 من 1 محافظة');
    expect(element.querySelector('tbody a')?.getAttribute('href')).toBe(
      '/regions/governorate-1/areas',
    );
  });

  it('shows the centred empty state, and no header button, when nothing exists', () => {
    const element = render({ getGovernorates: pageOf([]) }).nativeElement as HTMLElement;

    expect(element.textContent).toContain('لا توجد محافظات مضافة حتى الآن');
    expect(element.textContent).toContain('أضف أول محافظة إلى المنصة .');
    expect(element.querySelector('table')).toBeNull();
    expect(element.querySelectorAll('app-region-add-button')).toHaveLength(1);
  });

  it('draws placeholder rows while loading', () => {
    const element = render({ getGovernorates: () => NEVER }).nativeElement as HTMLElement;

    expect(element.querySelector('tbody[app-table-skeleton]')).toBeTruthy();
  });

  it('offers a retry when the list cannot load', () => {
    const element = render({
      getGovernorates: () => throwError(() => new Error('تعذر تحميل المحافظات')),
    }).nativeElement as HTMLElement;

    expect(element.querySelector('app-error-state')?.textContent).toContain('تعذر تحميل المحافظات');
  });

  it('adds a governorate through the add dialog', async () => {
    const createGovernorate = vi.fn(() => of(TARTUS));
    const fixture = render({ getGovernorates: pageOf([TARTUS]), createGovernorate });
    const element = fixture.nativeElement as HTMLElement;

    buttonNamed(element, 'إضافة محافظة')?.click();
    fixture.detectChanges();
    const name = element.querySelector('[data-testid="region-name"]') as HTMLInputElement;
    name.value = 'حماة';
    name.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    (element.querySelector('[data-testid="region-submit"]') as HTMLButtonElement).click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(createGovernorate).toHaveBeenCalledWith({ name: 'حماة', status: 'active' });
    expect(element.querySelector('[role="dialog"]')).toBeNull();
  });

  it('suspends a governorate after confirming', async () => {
    const setGovernorateStatus = vi.fn(() => of(TARTUS));
    const fixture = render({ getGovernorates: pageOf([TARTUS]), setGovernorateStatus });
    const element = fixture.nativeElement as HTMLElement;

    (element.querySelector('tbody button[aria-haspopup]') as HTMLButtonElement).click();
    fixture.detectChanges();
    buttonNamed(element, 'تغيير الحالة')?.click();
    fixture.detectChanges();
    expect(element.textContent).toContain('هل أنت متأكد من تعطيل محافظة طرطوس؟');

    buttonNamed(element, 'تعطيل المحافظة')?.click();
    await fixture.whenStable();

    expect(setGovernorateStatus).toHaveBeenCalledWith('governorate-1', 'suspended');
  });

  it('keeps the dialog open and shows the reason when a save fails', async () => {
    const fixture = render({
      getGovernorates: pageOf([TARTUS]),
      deleteGovernorate: () => throwError(() => new Error('تعذر حذف المحافظة')),
    });
    const element = fixture.nativeElement as HTMLElement;

    (element.querySelector('tbody button[aria-haspopup]') as HTMLButtonElement).click();
    fixture.detectChanges();
    buttonNamed(element, 'حذف')?.click();
    fixture.detectChanges();
    buttonNamed(element, 'حذف المحافظة')?.click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(element.querySelector('[role="dialog"]')).toBeTruthy();
    expect(element.querySelector('app-toast')?.textContent).toContain('تعذر حذف المحافظة');
  });
});
