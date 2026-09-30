import { provideRouter } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { NEVER, of, throwError } from 'rxjs';
import { CLOCK } from '../../../../core/config/clock';
import { FileSaver } from '../../../../shared/files/file-saver';
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

  it('opens the notification composer for the bulk notify action', () => {
    configure({ getPlaces: () => of({ items: [createPlace()], totalCount: 1 }) });

    const fixture = TestBed.createComponent(PlaceList);
    fixture.detectChanges();

    fixture.nativeElement.querySelectorAll('input[type="checkbox"]')[1].click();
    fixture.detectChanges();

    const buttons: HTMLButtonElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('button'),
    );
    buttons.find((button) => button.textContent?.trim() === 'إرسال إشعارات')?.click();
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('إرسال إشعار جماعي');
    expect(text).toContain('نوع وأهمية الإشعار');
  });

  it('warns that deleting cannot be undone', () => {
    configure({ getPlaces: () => of({ items: [createPlace()], totalCount: 1 }) });

    const fixture = TestBed.createComponent(PlaceList);
    fixture.detectChanges();

    fixture.nativeElement.querySelectorAll('input[type="checkbox"]')[1].click();
    fixture.detectChanges();

    const buttons: HTMLButtonElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('button'),
    );
    buttons.find((button) => button.textContent?.trim() === 'حذف')?.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('تنبيه: إجراء نهائي لا يمكن التراجع عنه');
  });
});

describe('PlaceList name', () => {
  it('links each place name to its details page', () => {
    configure({ getPlaces: () => of({ items: [createPlace({ id: 'place-7' })], totalCount: 1 }) });
    const fixture = TestBed.createComponent(PlaceList);
    fixture.detectChanges();

    const name = (fixture.nativeElement as HTMLElement).querySelector<HTMLAnchorElement>(
      '[data-role="open-place"]',
    );

    expect(name?.getAttribute('href')).toBe('/admin/places/place-7');
  });
});

describe('PlaceList row actions', () => {
  function render(repository: Partial<PlaceRepository>) {
    configure(repository);
    const fixture = TestBed.createComponent(PlaceList);
    fixture.detectChanges();
    return fixture;
  }

  function buttonNamed(element: HTMLElement, label: string): HTMLButtonElement | undefined {
    return Array.from(element.querySelectorAll('button')).find(
      (button) => button.textContent?.trim() === label,
    );
  }

  function pickRowMenuItem(fixture: ReturnType<typeof render>, label: string): void {
    const element = fixture.nativeElement as HTMLElement;
    (element.querySelector('tbody button[aria-haspopup]') as HTMLButtonElement).click();
    fixture.detectChanges();
    buttonNamed(element, label)?.click();
    fixture.detectChanges();
  }

  function openRowMenu(fixture: ReturnType<typeof render>): HTMLElement {
    const element = fixture.nativeElement as HTMLElement;
    (element.querySelector('tbody button[aria-haspopup]') as HTMLButtonElement).click();
    fixture.detectChanges();
    return element.querySelector('[data-testid="action-menu-panel"]') as HTMLElement;
  }

  it('lists the row actions in the frame order, the QR one second', () => {
    const panel = openRowMenu(
      render({ getPlaces: () => of({ items: [createPlace()], totalCount: 1 }) }),
    );

    const labels = [...panel.querySelectorAll('a, button')].map((item) => item.textContent?.trim());
    expect(labels).toEqual(['عرض التفاصيل', 'عرض رمز QR', 'تعديل', 'تغيير الحالة', 'حذف']);
  });

  it('puts each icon to the right of its label, on the square-cornered panel', () => {
    const panel = openRowMenu(
      render({ getPlaces: () => of({ items: [createPlace()], totalCount: 1 }) }),
    );

    const firstChildren = [...panel.querySelectorAll('a, button')].map((item) =>
      item.firstElementChild?.tagName.toLowerCase(),
    );
    expect(new Set(firstChildren)).toEqual(new Set(['app-icon']));
    expect(panel.classList).toContain('rounded-[2px]');
  });

  it('draws the delete label dark and only its bin red, as the frame does', () => {
    const panel = openRowMenu(
      render({ getPlaces: () => of({ items: [createPlace()], totalCount: 1 }) }),
    );
    const remove = [...panel.querySelectorAll('button')].at(-1) as HTMLButtonElement;

    expect(remove.querySelector('app-icon')?.classList).toContain('text-error');
    expect(remove.classList).toContain('text-text-primary');
    expect(remove.classList).not.toContain('text-error');
  });

  it('opens the QR dialog of the row, then closes it', () => {
    const fixture = render({
      getPlaces: () =>
        of({
          items: [createPlace({ publicUrl: 'https://mapmob.app/store/abualez' })],
          totalCount: 1,
        }),
    });
    const element = fixture.nativeElement as HTMLElement;

    pickRowMenuItem(fixture, 'عرض رمز QR');
    const dialog = element.querySelector('app-store-qr-dialog') as HTMLElement;
    expect((dialog.querySelector('input') as HTMLInputElement).value).toBe(
      'https://mapmob.app/store/abualez',
    );
    expect(dialog.querySelector('svg')?.getAttribute('aria-label')).toBe(
      'رمز QR لصفحة صيدلية الحياة',
    );

    (dialog.querySelector('button[aria-label="إغلاق النافذة"]') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(element.querySelector('app-store-qr-dialog')).toBeNull();
  });

  it('suspends the row behind the status change once it is confirmed', async () => {
    let saved = '';
    const fixture = render({
      getPlaces: () => of({ items: [createPlace()], totalCount: 1 }),
      setPlacesStatus: (ids, status) => {
        saved = `${ids.join(',')}|${status}`;
        return of(undefined);
      },
    });

    pickRowMenuItem(fixture, 'تغيير الحالة');
    expect(fixture.nativeElement.textContent).toContain('صيدلية الحياة');

    buttonNamed(fixture.nativeElement, 'إيقاف الشركات')?.click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(saved).toBe('place-1|suspended');
    expect(fixture.nativeElement.querySelector('app-confirm-dialog')).toBeNull();
  });

  it('activates a suspended row instead', async () => {
    let saved = '';
    const fixture = render({
      getPlaces: () => of({ items: [createPlace({ status: 'suspended' })], totalCount: 1 }),
      setPlacesStatus: (ids, status) => {
        saved = `${ids.join(',')}|${status}`;
        return of(undefined);
      },
    });

    pickRowMenuItem(fixture, 'تغيير الحالة');
    buttonNamed(fixture.nativeElement, 'تفعيل الشركات')?.click();
    await fixture.whenStable();

    expect(saved).toBe('place-1|active');
  });

  it('deletes the row behind the menu once it is confirmed', async () => {
    let deletedIds: readonly string[] = [];
    const fixture = render({
      getPlaces: () => of({ items: [createPlace()], totalCount: 1 }),
      deletePlaces: (ids) => {
        deletedIds = ids;
        return of(undefined);
      },
    });

    pickRowMenuItem(fixture, 'حذف');
    buttonNamed(fixture.nativeElement, 'حذف الشركات')?.click();
    await fixture.whenStable();

    expect(deletedIds).toEqual(['place-1']);
  });

  it('keeps the dialog open and says why when the write fails', async () => {
    const fixture = render({
      getPlaces: () => of({ items: [createPlace()], totalCount: 1 }),
      deletePlaces: () => throwError(() => new Error('تعذر حذف الشركة')),
    });

    pickRowMenuItem(fixture, 'حذف');
    buttonNamed(fixture.nativeElement, 'حذف الشركات')?.click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('تعذر حذف الشركة');
  });

  it('suspends every ticked row from the bulk bar', async () => {
    let saved = '';
    const fixture = render({
      getPlaces: () =>
        of({ items: [createPlace(), createPlace({ id: 'place-2' })], totalCount: 2 }),
      setPlacesStatus: (ids, status) => {
        saved = `${ids.join(',')}|${status}`;
        return of(undefined);
      },
    });

    (fixture.nativeElement.querySelectorAll('input[type="checkbox"]')[0] as HTMLElement).click();
    fixture.detectChanges();
    buttonNamed(fixture.nativeElement, 'إيقاف')?.click();
    fixture.detectChanges();
    buttonNamed(fixture.nativeElement, 'إيقاف الشركات')?.click();
    await fixture.whenStable();

    expect(saved).toBe('place-1,place-2|suspended');
  });
});

describe('PlaceList export', () => {
  it('saves the exported file the header button asks for', async () => {
    const saved: string[] = [];
    configure({
      getPlaces: () => of({ items: [createPlace()], totalCount: 1 }),
      exportPlaces: () => of(new Blob(['csv'])),
    });
    TestBed.overrideProvider(FileSaver, {
      useValue: { save: (_file: Blob, name: string) => saved.push(name) },
    });
    TestBed.overrideProvider(CLOCK, { useValue: () => new Date(2026, 8, 20) });

    const fixture = TestBed.createComponent(PlaceList);
    fixture.detectChanges();

    const exportButton = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll('button'),
    ).find((button) => button.textContent?.trim() === 'تصدير');
    exportButton?.click();
    await fixture.whenStable();

    expect(saved).toEqual(['places-2026-09-20.csv']);
  });
});
