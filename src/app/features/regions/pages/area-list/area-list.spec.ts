import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { AreaRepository } from '../../data/area.repository';
import { GovernorateRepository } from '../../data/governorate.repository';
import { Area } from '../../models/area';
import { buildArea, buildGovernorate } from '../../testing/region-entry-fixture';
import { AreaList } from './area-list';

const TARTUS = buildGovernorate({ id: 'governorate-1', name: 'طرطوس' });
const SAFITA = buildArea({ id: 'area-1', name: 'صافيتا' });

function render(areas: Area[], areaOverrides: Partial<AreaRepository> = {}) {
  const getAreas = vi.fn(() => of({ items: areas, totalCount: areas.length }));
  TestBed.configureTestingModule({
    providers: [
      provideRouter([]),
      { provide: AreaRepository, useValue: { getAreas, ...areaOverrides } },
      { provide: GovernorateRepository, useValue: { getGovernorate: () => of(TARTUS) } },
    ],
  });
  const fixture = TestBed.createComponent(AreaList);
  fixture.componentRef.setInput('governorateId', 'governorate-1');
  fixture.detectChanges();
  return { fixture, getAreas };
}

describe('AreaList', () => {
  it('loads the areas of the governorate in the address', () => {
    const { getAreas } = render([SAFITA]);

    expect(getAreas).toHaveBeenCalledWith(
      expect.objectContaining({ governorateId: 'governorate-1', pageIndex: 0 }),
    );
  });

  it('shows the breadcrumb, the governorate title and the area rows', () => {
    const element = render([SAFITA]).fixture.nativeElement as HTMLElement;

    const crumb = element.querySelector('nav a') as HTMLAnchorElement;
    expect(crumb.textContent?.trim()).toBe('المحافظات و المناطق');
    expect(crumb.getAttribute('href')).toBe('/regions');
    expect(element.querySelector('nav')?.textContent).toContain('المناطق');
    expect(element.querySelector('h1')?.textContent?.trim()).toBe('مناطق طرطوس');
    expect(element.textContent).toContain('إدارة المناطق التابعة لمحافظة طرطوس .');
    expect((element.querySelector('input[type="search"]') as HTMLInputElement).placeholder).toBe(
      'ابحث عن منطقة...',
    );
    expect(element.querySelectorAll('th')[1].textContent?.trim()).toBe('المنطقة');
    expect(element.textContent).toContain('صافيتا');
    expect(element.textContent).toContain('عرض 1- 1 من 1 منطقة');
  });

  it('shows the empty state for a governorate with no areas', () => {
    const element = render([]).fixture.nativeElement as HTMLElement;

    expect(element.textContent).toContain('لا توجد مناطق مضافة في محافظة طرطوس حتى الآن');
    expect(element.textContent).toContain('أضف أول منطقة إلى المنصة .');
  });

  it('adds an area inside the governorate, showing the governorate locked', async () => {
    const createArea = vi.fn(() => of(SAFITA));
    const { fixture } = render([SAFITA], { createArea });
    const element = fixture.nativeElement as HTMLElement;

    (element.querySelector('app-region-add-button button') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(
      (element.querySelector('[data-testid="locked-governorate"]') as HTMLInputElement).value,
    ).toBe('طرطوس');

    const name = element.querySelector('[data-testid="region-name"]') as HTMLInputElement;
    name.value = 'بانياس';
    name.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    (element.querySelector('[data-testid="region-submit"]') as HTMLButtonElement).click();
    await fixture.whenStable();

    expect(createArea).toHaveBeenCalledWith('governorate-1', { name: 'بانياس', status: 'active' });
  });

  it('keeps the typed search instead of reopening the governorate', () => {
    const { fixture, getAreas } = render([SAFITA]);
    const search = fixture.nativeElement.querySelector('input[type="search"]') as HTMLInputElement;

    search.value = 'صا';
    search.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(getAreas).toHaveBeenLastCalledWith(expect.objectContaining({ search: 'صا' }));
    expect(getAreas).toHaveBeenCalledTimes(2);
  });
});
