import { provideRouter } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { NEVER, of, throwError } from 'rxjs';
import { PlaceRepository } from '../../data/place.repository';
import { createPlace } from '../../testing/place-fixture';
import { PlaceList } from './place-list';

const COUNTS = { all: 120, active: 90, pending: 10, suspended: 20 };

function configure(repository: Partial<PlaceRepository>) {
  TestBed.configureTestingModule({
    providers: [
      provideRouter([]),
      {
        provide: PlaceRepository,
        useValue: { getStatusCounts: () => of(COUNTS), ...repository },
      },
    ],
  });
}

describe('PlaceList', () => {
  it('renders the title and place rows when there are results', () => {
    configure({ getPlaces: () => of({ items: [createPlace()], totalCount: 1 }) });

    const fixture = TestBed.createComponent(PlaceList);
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('الشركات والمتاجر');
    expect(text).toContain('صيدلية الحياة');
  });

  it('renders the place code and package next to each row', () => {
    configure({
      getPlaces: () => of({ items: [createPlace({ package: 'premium' })], totalCount: 1 }),
    });

    const fixture = TestBed.createComponent(PlaceList);
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('ID #1024');
    expect(text).toContain('مميزة');
  });

  it('shows the status chips with their counts', () => {
    configure({ getPlaces: () => of({ items: [createPlace()], totalCount: 1 }) });

    const fixture = TestBed.createComponent(PlaceList);
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('(120)');
    expect(text).toContain('(90)');
  });

  it('shows the bulk action bar once a row is ticked', () => {
    configure({ getPlaces: () => of({ items: [createPlace()], totalCount: 1 }) });

    const fixture = TestBed.createComponent(PlaceList);
    fixture.detectChanges();

    const rowCheckbox: HTMLInputElement =
      fixture.nativeElement.querySelectorAll('input[type="checkbox"]')[1];
    rowCheckbox.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('عدد العناصر المحددة: 1');
  });

  it('opens the confirm dialog for the bulk activate action', () => {
    configure({ getPlaces: () => of({ items: [createPlace()], totalCount: 1 }) });

    const fixture = TestBed.createComponent(PlaceList);
    fixture.detectChanges();

    fixture.nativeElement.querySelectorAll('input[type="checkbox"]')[1].click();
    fixture.detectChanges();

    const buttons: HTMLButtonElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('button'),
    );
    buttons.find((button) => button.textContent?.trim() === 'تفعيل')?.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('هل أنت متأكد من تفعيل الشركات المحددة؟');
  });

  it('shows the empty state when there are no places', () => {
    configure({ getPlaces: () => of({ items: [], totalCount: 0 }) });

    const fixture = TestBed.createComponent(PlaceList);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('لا توجد أماكن مضافة حتى الآن');
  });
  it('shows placeholder rows while the places load', () => {
    configure({ getPlaces: () => NEVER });

    const fixture = TestBed.createComponent(PlaceList);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('tbody[app-table-skeleton]')).toBeTruthy();
    expect(fixture.nativeElement.textContent).not.toContain('لا توجد أماكن مضافة حتى الآن');
  });

  it('offers a retry when the places cannot be loaded', () => {
    let callCount = 0;
    configure({
      getPlaces: () => {
        callCount += 1;
        return throwError(() => new Error('تعذر الاتصال بالخادم'));
      },
    });

    const fixture = TestBed.createComponent(PlaceList);
    fixture.detectChanges();

    const alert: HTMLElement = fixture.nativeElement.querySelector('[role="alert"]');
    expect(alert.textContent).toContain('تعذر الاتصال بالخادم');

    alert.querySelector('button')!.click();
    expect(callCount).toBe(2);
  });
});
