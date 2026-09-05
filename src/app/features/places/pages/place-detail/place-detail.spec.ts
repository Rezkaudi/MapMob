import { provideRouter } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { NEVER, of, throwError } from 'rxjs';
import { PlaceRepository } from '../../data/place.repository';
import { createPlaceDetail } from '../../testing/place-detail-fixture';
import { PlaceDetail } from './place-detail';

describe('PlaceDetail', () => {
  function render() {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: PlaceRepository, useValue: { getPlace: () => of(createPlaceDetail()) } },
      ],
    });
    const fixture = TestBed.createComponent(PlaceDetail);
    fixture.componentRef.setInput('id', 'place-1');
    fixture.detectChanges();
    return fixture;
  }

  it('shows the name, status and address in the header', () => {
    const text = render().nativeElement.textContent;

    expect(text).toContain('صيدلية الحياة');
    expect(text).toContain('نشط');
    expect(text).toContain('شارع الثورة');
  });

  it('shows the owner, the subscription and the activity log', () => {
    const text = render().nativeElement.textContent;

    expect(text).toContain('أحمد عبدالله');
    expect(text).toContain('مميزة');
    expect(text).toContain('منذ يومين');
  });

  it('shows the working hours and the contact channels', () => {
    const text = render().nativeElement.textContent;

    expect(text).toContain('أوقات العمل');
    expect(text).toContain('10:00 AM - 10:00 PM');
    expect(text).toContain('https://facebook.com/alhayatpharmacy');
  });
  it('draws a placeholder page while the place loads', () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: PlaceRepository, useValue: { getPlace: () => NEVER } },
      ],
    });
    const fixture = TestBed.createComponent(PlaceDetail);
    fixture.componentRef.setInput('id', 'place-1');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('app-skeleton').length).toBeGreaterThan(0);
  });

  it('offers a retry when the place cannot be loaded', () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        {
          provide: PlaceRepository,
          useValue: { getPlace: () => throwError(() => new Error('تعذر تحميل المكان')) },
        },
      ],
    });
    const fixture = TestBed.createComponent(PlaceDetail);
    fixture.componentRef.setInput('id', 'place-1');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[role="alert"]').textContent).toContain(
      'تعذر تحميل المكان',
    );
  });
});
