import { TestBed } from '@angular/core/testing';
import { AdFilters, NO_AD_FILTERS } from '../../models/ad-filters';
import { AdFilterPanel } from './ad-filter-panel';

function render(filters: AdFilters = NO_AD_FILTERS) {
  const fixture = TestBed.createComponent(AdFilterPanel);
  fixture.componentRef.setInput('filters', filters);
  fixture.detectChanges();
  return fixture;
}

function chipsIn(element: HTMLElement, group: string): HTMLButtonElement[] {
  return Array.from(element.querySelectorAll(`[role="radiogroup"][aria-label="${group}"] button`));
}

function buttonNamed(element: HTMLElement, label: string): HTMLButtonElement {
  return Array.from(element.querySelectorAll('button')).find(
    (button) => button.textContent?.trim() === label,
  ) as HTMLButtonElement;
}

describe('AdFilterPanel', () => {
  it('shows the five groups of the design', () => {
    const element = render().nativeElement as HTMLElement;
    const labelsOf = (group: string) =>
      chipsIn(element, group).map((chip) => chip.textContent?.trim());

    expect(element.textContent).toContain('تصفية الإعلانات');
    expect(labelsOf('الحالة')).toEqual(['الكل', 'نشط', 'مسودة', 'قادم', 'منتهي', 'متوقف']);
    expect(labelsOf('نوع المحتوى')).toEqual(['صورة', 'فيديو']);
    expect(labelsOf('المعلن')).toEqual(['الإدارة', 'الشركة']);
    expect(element.querySelector('select[aria-label="مكان ظهور الإعلان"]')).toBeTruthy();
    expect(element.textContent).toContain('تاريخ الإعلان');
  });

  it('applies every pick at once, and a second click on a type clears it', () => {
    const fixture = render();
    const applied = vi.fn();
    fixture.componentInstance.applied.subscribe(applied);
    const element = fixture.nativeElement as HTMLElement;

    chipsIn(element, 'الحالة')[3].click();
    fixture.detectChanges();
    chipsIn(element, 'نوع المحتوى')[1].click();
    fixture.detectChanges();
    chipsIn(element, 'المعلن')[0].click();
    fixture.detectChanges();
    chipsIn(element, 'المعلن')[0].click();
    fixture.detectChanges();
    const placement = element.querySelector('select') as HTMLSelectElement;
    placement.value = 'home';
    placement.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    buttonNamed(element, 'تطبيق الفلاتر').click();

    expect(applied).toHaveBeenCalledWith({
      ...NO_AD_FILTERS,
      status: 'scheduled',
      contentType: 'video',
      advertiserType: null,
      placement: 'home',
    });
  });

  it('resets everything and applies that straight away', () => {
    const fixture = render({ ...NO_AD_FILTERS, status: 'active', placement: 'home' });
    const applied = vi.fn();
    fixture.componentInstance.applied.subscribe(applied);

    buttonNamed(fixture.nativeElement, 'إعادة ضبط').click();

    expect(applied).toHaveBeenCalledWith(NO_AD_FILTERS);
  });
});
