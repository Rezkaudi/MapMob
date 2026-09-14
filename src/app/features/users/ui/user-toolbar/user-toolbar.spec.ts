import { TestBed } from '@angular/core/testing';
import { NO_USER_FILTERS } from '../../models/user-filters';
import { UserToolbar } from './user-toolbar';

function render(activeFilterCount = 0) {
  const fixture = TestBed.createComponent(UserToolbar);
  fixture.componentRef.setInput('filters', NO_USER_FILTERS);
  fixture.componentRef.setInput('activeFilterCount', activeFilterCount);
  fixture.detectChanges();
  return fixture;
}

function filterButton(element: HTMLElement): HTMLButtonElement {
  return element.querySelector('button[aria-controls="user-filter-panel"]') as HTMLButtonElement;
}

describe('UserToolbar', () => {
  it('reports search and sort changes', () => {
    const fixture = render();
    const searchChange = vi.fn();
    const sortChange = vi.fn();
    fixture.componentInstance.searchChange.subscribe(searchChange);
    fixture.componentInstance.sortChange.subscribe(sortChange);
    const element = fixture.nativeElement as HTMLElement;

    const search = element.querySelector('input[type="search"]') as HTMLInputElement;
    search.value = 'أحمد';
    search.dispatchEvent(new Event('input'));
    const sort = element.querySelector('select') as HTMLSelectElement;
    sort.value = 'name';
    sort.dispatchEvent(new Event('change'));

    expect(searchChange).toHaveBeenCalledWith('أحمد');
    expect(sortChange).toHaveBeenCalledWith('name');
  });

  it('opens and closes the filter panel from the "الفلاتر" button', () => {
    const fixture = render();
    const element = fixture.nativeElement as HTMLElement;
    const button = filterButton(element);
    expect(button.textContent?.trim()).toBe('الفلاتر');
    expect(element.querySelector('app-user-filter-panel')).toBeNull();

    button.click();
    fixture.detectChanges();
    expect(button.getAttribute('aria-expanded')).toBe('true');
    expect(element.querySelector('app-user-filter-panel')).toBeTruthy();

    button.click();
    fixture.detectChanges();
    expect(element.querySelector('app-user-filter-panel')).toBeNull();
  });

  it('passes the applied filters on and closes the panel', () => {
    const fixture = render();
    const filtersApply = vi.fn();
    fixture.componentInstance.filtersApply.subscribe(filtersApply);
    const element = fixture.nativeElement as HTMLElement;
    filterButton(element).click();
    fixture.detectChanges();

    const apply = Array.from(element.querySelectorAll('button')).find(
      (button) => button.textContent?.trim() === 'تطبيق الفلاتر',
    ) as HTMLButtonElement;
    apply.click();
    fixture.detectChanges();

    expect(filtersApply).toHaveBeenCalledWith(NO_USER_FILTERS);
    expect(element.querySelector('app-user-filter-panel')).toBeNull();
  });

  it('closes the panel on Escape and on a click outside it', () => {
    const fixture = render();
    const element = fixture.nativeElement as HTMLElement;
    filterButton(element).click();
    fixture.detectChanges();

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    fixture.detectChanges();
    expect(element.querySelector('app-user-filter-panel')).toBeNull();

    filterButton(element).click();
    fixture.detectChanges();
    document.body.click();
    fixture.detectChanges();
    expect(element.querySelector('app-user-filter-panel')).toBeNull();
  });

  it('counts the active filters on the button for screen readers', () => {
    expect(filterButton(render(2).nativeElement).getAttribute('aria-label')).toBe(
      'الفلاتر، 2 مفعلة',
    );
  });
});
