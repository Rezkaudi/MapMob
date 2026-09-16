import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { AdRepository } from '../../data/ad.repository';
import { AdDraft } from '../../models/ad-draft';
import { buildAd, buildAdDetail } from '../../testing/ad-fixture';
import { AdForm } from './ad-form';

const OPTIONS = {
  places: [
    { id: 'place-3', name: 'صيدلية الحياة' },
    { id: 'place-4', name: 'مطعم الأصالة' },
  ],
};

function createPage(editingId?: string) {
  const created: AdDraft[] = [];
  const updated: string[] = [];
  const repository: Partial<AdRepository> = {
    getFormOptions: () => of(OPTIONS),
    getAdDetail: () => of(buildAdDetail()),
    createAd: (draft) => {
      created.push(draft);
      return of(buildAd());
    },
    updateAd: (id) => {
      updated.push(id);
      return of(buildAd());
    },
  };
  TestBed.configureTestingModule({
    providers: [provideRouter([]), { provide: AdRepository, useValue: repository }],
  });
  const navigateByUrl = vi.spyOn(TestBed.inject(Router), 'navigateByUrl').mockResolvedValue(true);
  const fixture = TestBed.createComponent(AdForm);
  if (editingId) {
    fixture.componentRef.setInput('id', editingId);
  }
  fixture.detectChanges();
  return {
    fixture,
    element: fixture.nativeElement as HTMLElement,
    created,
    updated,
    navigateByUrl,
  };
}

type Page = ReturnType<typeof createPage>;

function setValue(page: Page, selector: string, value: string, eventName = 'input'): void {
  const control = page.element.querySelector(selector) as HTMLInputElement | HTMLSelectElement;
  control.value = value;
  control.dispatchEvent(new Event(eventName));
  page.fixture.detectChanges();
}

function buttonNamed(root: ParentNode, label: string): HTMLButtonElement {
  return Array.from(root.querySelectorAll('button')).find(
    (button) => button.textContent?.trim() === label,
  ) as HTMLButtonElement;
}

async function settle(page: Page): Promise<void> {
  await page.fixture.whenStable();
  page.fixture.detectChanges();
}

describe('AdForm', () => {
  it('lays out the four cards of the add page', () => {
    const { element } = createPage();

    expect(element.querySelector('h1')?.textContent?.trim()).toBe('إضافة إعلان جديد');
    expect(element.textContent).toContain('أضف إعلاناً جديداً وحدد كامل التفاصيل.');
    expect(
      Array.from(element.querySelectorAll('app-form-card h2'), (heading) =>
        heading.textContent?.trim(),
      ),
    ).toEqual([
      'المعلومات الأساسية للإعلان',
      'محتوى ووسائط الإعلان',
      'مكان وموضع الظهور',
      'مدة العرض، الأولوية والحالة',
    ]);
    expect(
      element.querySelector('app-form-action-bar button[type="submit"]')?.textContent?.trim(),
    ).toBe('حفظ الإعلان ونشره');
  });

  it('hides the store field for an app ad', () => {
    const page = createPage();
    expect(page.element.querySelector('#ad-place')).toBeTruthy();

    (
      page.element.querySelectorAll('app-ad-basic-info-card [role="radio"]')[1] as HTMLButtonElement
    ).click();
    page.fixture.detectChanges();

    expect(page.element.querySelector('#ad-place')).toBeNull();
  });

  it('explains what is missing instead of saving an empty form', async () => {
    const page = createPage();

    buttonNamed(page.element, 'حفظ الإعلان ونشره').click();
    await settle(page);

    expect(page.created).toEqual([]);
    expect(page.element.textContent).toContain('اكتب عنوان الإعلان');
    expect(page.element.textContent).toContain('اختر الشركة أو المتجر التابع للإعلان');
  });

  it('publishes a filled ad and goes back to the list, or saves it as a draft', async () => {
    const page = createPage();
    setValue(page, '#ad-title', 'حملة الصيف');
    setValue(page, '#ad-place', 'place-3', 'change');
    setValue(page, '#ad-starts-on', '2026-10-15');
    (page.element.querySelector('#ad-is-ongoing') as HTMLInputElement).click();
    page.fixture.detectChanges();
    setValue(page, '#ad-placement', 'searchResults', 'change');

    buttonNamed(page.element, 'حفظ الإعلان ونشره').click();
    await settle(page);
    buttonNamed(page.element, 'حفظ كمسودة').click();
    await settle(page);

    expect(page.created[0]).toMatchObject({
      title: 'حملة الصيف',
      advertiserType: 'place',
      placeId: 'place-3',
      placement: 'searchResults',
      startsOn: '2026-10-15',
      endsOn: null,
      status: 'active',
    });
    expect(page.created[1].status).toBe('draft');
    expect(page.navigateByUrl).toHaveBeenCalledWith('/ads');
  });

  it('opens an ad for editing with its saved values, and updates it', async () => {
    const page = createPage('ad-2');

    expect(page.element.querySelector('h1')?.textContent?.trim()).toBe('تعديل الإعلان');
    expect((page.element.querySelector('#ad-title') as HTMLInputElement).value).toBe(
      'حملة الصيف لصيدلية الحياة',
    );
    expect((page.element.querySelector('#ad-place') as HTMLSelectElement).value).toBe('place-3');

    buttonNamed(page.element, 'حفظ الإعلان ونشره').click();
    await settle(page);

    expect(page.updated).toEqual(['ad-2']);
  });
});
