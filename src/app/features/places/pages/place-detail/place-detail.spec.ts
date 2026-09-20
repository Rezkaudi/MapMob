import { Router, provideRouter } from '@angular/router';
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

  it('shows the promotional offers section with a card per offer', () => {
    const fixture = render();
    const text = fixture.nativeElement.textContent;

    expect(text).toContain('العروض الترويجية');
    expect(text).toContain('العروض الترويجية الحالية الخاصة بصيدلية الحياة');
    expect(text).toContain('خصم 20 % على جميع المنتجات');
    expect(fixture.nativeElement.querySelectorAll('app-offer-card').length).toBe(3);
  });

  it('shows the video gallery section', () => {
    const text = render().nativeElement.textContent;

    expect(text).toContain('معرض الفيديوهات');
    expect(text).toContain('الفيديوهات التعريفية للمكان');
    expect(text).toContain('إضافة فيديو');
  });

  it('shows the products and services table', () => {
    const text = render().nativeElement.textContent;

    expect(text).toContain('المنتجات و الخدمات');
    expect(text).toContain('بعض من المنتجات والخدمات التي يقدمها المكان.');
    expect(text).toContain('سيروم تحت العين');
    expect(text).toContain('200 ل.س');
  });
});

describe('PlaceDetail actions', () => {
  function render(repository: Partial<PlaceRepository>) {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([{ path: 'places', children: [] }]),
        {
          provide: PlaceRepository,
          useValue: { getPlace: () => of(createPlaceDetail()), ...repository },
        },
      ],
    });
    const fixture = TestBed.createComponent(PlaceDetail);
    fixture.componentRef.setInput('id', 'place-1');
    fixture.detectChanges();
    return fixture;
  }

  function buttonNamed(element: HTMLElement, label: string): HTMLButtonElement | undefined {
    return Array.from(element.querySelectorAll('button')).find(
      (button) => button.textContent?.trim() === label,
    );
  }

  function confirmDialog(fixture: { nativeElement: HTMLElement }): HTMLElement {
    return fixture.nativeElement.querySelector('app-confirm-action-dialog') as HTMLElement;
  }

  it('suspends the place once the dialog is confirmed', async () => {
    let saved = '';
    const fixture = render({
      setPlacesStatus: (ids, status) => {
        saved = `${ids.join(',')}|${status}`;
        return of(undefined);
      },
    });

    buttonNamed(fixture.nativeElement, 'إيقاف النشاط')?.click();
    fixture.detectChanges();
    buttonNamed(confirmDialog(fixture), 'إيقاف النشاط')?.click();
    await fixture.whenStable();

    expect(saved).toBe('place-1|suspended');
  });

  it('leaves the page for the list once the place is deleted', async () => {
    let deletedIds: readonly string[] = [];
    const fixture = render({
      deletePlaces: (ids) => {
        deletedIds = ids;
        return of(undefined);
      },
    });

    buttonNamed(fixture.nativeElement, 'حذف المكان')?.click();
    fixture.detectChanges();
    buttonNamed(confirmDialog(fixture), 'حذف المكان')?.click();
    await fixture.whenStable();

    expect(deletedIds).toEqual(['place-1']);
    expect(TestBed.inject(Router).url).toBe('/places');
  });
});
