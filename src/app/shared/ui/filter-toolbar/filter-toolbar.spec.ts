import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FilterToolbar } from './filter-toolbar';

@Component({
  imports: [FilterToolbar],
  template: `
    <app-filter-toolbar
      searchPlaceholder="ابحث عن تقييم.."
      panelId="test-filter-panel"
      [activeFilterCount]="activeFilterCount()"
      [controlGap]="8"
      (searchChange)="searches.push($event)"
      (sortChange)="sorts.push($event)"
    >
      <ng-template let-close="close">
        <div data-testid="panel">
          <button type="button" (click)="close()">تم</button>
        </div>
      </ng-template>
    </app-filter-toolbar>
  `,
})
class HostComponent {
  readonly activeFilterCount = signal(0);
  readonly searches: string[] = [];
  readonly sorts: (string | null)[] = [];
}

function render(activeFilterCount = 0) {
  const fixture = TestBed.createComponent(HostComponent);
  fixture.componentInstance.activeFilterCount.set(activeFilterCount);
  fixture.detectChanges();
  return fixture;
}

function filterButton(element: HTMLElement): HTMLButtonElement {
  return element.querySelector('button[aria-controls="test-filter-panel"]') as HTMLButtonElement;
}

describe('FilterToolbar', () => {
  it('reports search and sort changes', () => {
    const fixture = render();
    const element = fixture.nativeElement as HTMLElement;

    const search = element.querySelector('input[type="search"]') as HTMLInputElement;
    expect(search.placeholder).toBe('ابحث عن تقييم..');
    search.value = 'سارة';
    search.dispatchEvent(new Event('input'));
    const sort = element.querySelector('select') as HTMLSelectElement;
    sort.value = 'newest';
    sort.dispatchEvent(new Event('change'));

    expect(fixture.componentInstance.searches).toEqual(['سارة']);
    expect(fixture.componentInstance.sorts).toEqual(['newest']);
  });

  it('spaces the sort field and the filter button as asked', () => {
    const element = render().nativeElement as HTMLElement;

    const controls = element.querySelector('app-sort-select')?.parentElement as HTMLElement;
    expect(controls.style.gap).toBe('8px');
  });

  it('opens the projected panel from "الفلاتر" and lets the panel close itself', () => {
    const fixture = render();
    const element = fixture.nativeElement as HTMLElement;
    const button = filterButton(element);
    expect(button.textContent?.trim()).toBe('الفلاتر');
    expect(element.querySelector('[data-testid="panel"]')).toBeNull();

    button.click();
    fixture.detectChanges();
    expect(button.getAttribute('aria-expanded')).toBe('true');
    (element.querySelector('[data-testid="panel"] button') as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(element.querySelector('[data-testid="panel"]')).toBeNull();
  });

  it('closes the panel on Escape and on a click outside it', () => {
    const fixture = render();
    const element = fixture.nativeElement as HTMLElement;
    filterButton(element).click();
    fixture.detectChanges();

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    fixture.detectChanges();
    expect(element.querySelector('[data-testid="panel"]')).toBeNull();

    filterButton(element).click();
    fixture.detectChanges();
    document.body.click();
    fixture.detectChanges();
    expect(element.querySelector('[data-testid="panel"]')).toBeNull();
  });

  it('counts the active filters on the button for screen readers', () => {
    expect(filterButton(render(2).nativeElement).getAttribute('aria-label')).toBe(
      'الفلاتر، 2 مفعلة',
    );
    expect(filterButton(render(0).nativeElement).getAttribute('aria-label')).toBeNull();
  });
});
