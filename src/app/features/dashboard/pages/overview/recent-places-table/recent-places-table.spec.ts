import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RecentPlace } from '../../../models/recent-place';
import { RecentPlacesTable } from './recent-places-table';

const PLACES: readonly RecentPlace[] = [
  {
    id: 'place-1',
    name: 'صيدلية الحياة',
    category: 'صيدلية',
    city: 'الرياض',
    rating: 4.9,
    status: 'active',
    joinedAt: '2024-01-12',
    logoUrl: 'assets/pharmacy-logo.jpg',
  },
];

@Component({
  imports: [RecentPlacesTable],
  template: `<app-recent-places-table [places]="places" />`,
})
class HostComponent {
  readonly places = PLACES;
}

describe('RecentPlacesTable', () => {
  beforeEach(() => TestBed.configureTestingModule({ providers: [provideRouter([])] }));

  it('shows the heading and the view-all link', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('أحدث الشركات والمتاجر');
    expect(text).toContain('عرض الكل');
  });

  it('sends the view-all link to the places list', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const viewAll: HTMLAnchorElement =
      fixture.nativeElement.querySelector('[data-role="view-all"]');
    expect(viewAll.getAttribute('href')).toBe('/places');
  });

  // A CSS filter makes the card the frame for fixed children, so the row menu would open far from its button.
  it('draws the card shadow without a filter so the row menu opens by its button', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const card: HTMLElement = fixture.nativeElement.querySelector(
      'app-recent-places-table section',
    );
    expect(card.className).not.toContain('drop-shadow');
  });

  it('opens each row on its place detail page', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    fixture.nativeElement.querySelector('tbody app-action-menu button').click();
    fixture.detectChanges();

    const detail: HTMLAnchorElement = fixture.nativeElement.querySelector(
      '[data-role="row-detail"]',
    );
    expect(detail.getAttribute('href')).toBe('/places/place-1');
  });

  it('lists every column the design asks for', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const headers = Array.from<HTMLElement>(fixture.nativeElement.querySelectorAll('th')).map(
      (cell) => cell.textContent!.trim(),
    );
    expect(headers).toEqual([
      'الشركة',
      'الفئة',
      'الموقع',
      'الحالة',
      'التقييم',
      'تاريخ الانضمام',
      'الإجراء',
    ]);
  });

  it('renders a row with its status label and Arabic join date', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const row = fixture.nativeElement.querySelector('tbody tr');
    expect(row.textContent).toContain('صيدلية الحياة');
    expect(row.textContent).toContain('نشط');
    expect(row.textContent).toContain('٢٠٢٤');
  });

  it('shows the company logo when the place has one', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const logo: HTMLImageElement = fixture.nativeElement.querySelector('tbody img');
    expect(logo.getAttribute('src')).toBe('assets/pharmacy-logo.jpg');
    expect(logo.getAttribute('alt')).toBe('صيدلية الحياة');
  });

  it('falls back to the first letter when a place has no logo', () => {
    const fixture = TestBed.createComponent(RecentPlacesTable);
    fixture.componentRef.setInput('places', [{ ...PLACES[0], logoUrl: null }]);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('tbody img')).toBeNull();
    expect(
      fixture.nativeElement.querySelector('[data-role="logo-fallback"]').textContent.trim(),
    ).toBe('ص');
  });
});

describe('RecentPlacesTable while loading', () => {
  @Component({
    imports: [RecentPlacesTable],
    template: `<app-recent-places-table [places]="[]" [isLoading]="true" />`,
  })
  class HostLoadingComponent {}

  beforeEach(() => TestBed.configureTestingModule({ providers: [provideRouter([])] }));

  it('draws placeholder rows', () => {
    const fixture = TestBed.createComponent(HostLoadingComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('tbody[app-table-skeleton]')).toBeTruthy();
  });
});

describe('RecentPlacesTable name', () => {
  beforeEach(() => TestBed.configureTestingModule({ providers: [provideRouter([])] }));

  it('links each place name to its details page', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const name = (fixture.nativeElement as HTMLElement).querySelector<HTMLAnchorElement>(
      '[data-role="open-place"]',
    );

    expect(name?.getAttribute('href')).toBe('/places/place-1');
  });
});
