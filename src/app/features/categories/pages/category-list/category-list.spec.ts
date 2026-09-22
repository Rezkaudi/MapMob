import { TestBed } from '@angular/core/testing';
import { NEVER, Observable, of, throwError } from 'rxjs';
import { CategoryRepository } from '../../data/category.repository';
import { Category } from '../../models/category';
import { CategoryPage } from '../../models/category-page';
import { buildCategory } from '../../testing/category-fixture';
import { CategoryList } from './category-list';

const RESTAURANTS = buildCategory({ id: 'm1', name: 'مطاعم' });

function pageOf(items: Category[]): () => Observable<CategoryPage> {
  return () =>
    of({ items, totalCount: items.length, kindCounts: { all: items.length, main: 1, sub: 0 } });
}

function render(repository: Partial<CategoryRepository>) {
  TestBed.configureTestingModule({
    providers: [
      {
        provide: CategoryRepository,
        useValue: { getMainCategories: () => of([{ id: 'm1', name: 'مطاعم' }]), ...repository },
      },
    ],
  });
  const fixture = TestBed.createComponent(CategoryList);
  fixture.detectChanges();
  return fixture;
}

function buttonNamed(element: HTMLElement, label: string): HTMLButtonElement | undefined {
  return Array.from(element.querySelectorAll('button')).find(
    (button) => button.textContent?.trim() === label,
  );
}

function openRowMenuItem(fixture: ReturnType<typeof render>, label: string): void {
  const element = fixture.nativeElement as HTMLElement;
  (element.querySelector('tbody button[aria-haspopup]') as HTMLButtonElement).click();
  fixture.detectChanges();
  buttonNamed(element, label)?.click();
  fixture.detectChanges();
}

describe('CategoryList', () => {
  it('shows the header, the filters with counts, the rows and the page range', () => {
    const element = render({ getCategories: pageOf([RESTAURANTS]) }).nativeElement as HTMLElement;

    expect(element.querySelector('h1')?.textContent?.trim()).toBe('التصنيفات');
    expect(element.textContent).toContain('إدارة  و تنظيم  التصنيفات الرئيسية و الفرعية .');
    expect(buttonNamed(element, 'إضافة تصنيف جديد')).toBeTruthy();
    expect(element.querySelector('app-filter-chips')?.textContent?.replace(/\s+/g, '')).toContain(
      'الكل(1)',
    );
    expect(element.querySelector('tbody')?.textContent).toContain('مطاعم');
    expect(element.textContent).toContain('عرض 1- 1 من 1 تصنيف');
    const parentFilter = element.querySelectorAll('app-category-toolbar select')[2];
    expect(parentFilter.textContent).toContain('مطاعم');
  });

  it('says so when no category exists yet', () => {
    const element = render({ getCategories: pageOf([]) }).nativeElement as HTMLElement;

    expect(element.textContent).toContain('لا توجد تصنيفات مضافة حتى الآن');
  });

  it('draws placeholder rows while loading', () => {
    const element = render({ getCategories: () => NEVER }).nativeElement as HTMLElement;

    expect(element.querySelector('tbody[app-table-skeleton]')).toBeTruthy();
  });

  it('offers a retry when the list cannot load', () => {
    const element = render({
      getCategories: () => throwError(() => new Error('تعذر تحميل التصنيفات')),
    }).nativeElement as HTMLElement;

    expect(element.querySelector('app-error-state')?.textContent).toContain('تعذر تحميل التصنيفات');
  });

  it('adds a category through the add dialog', async () => {
    const createCategory = vi.fn(() => of(RESTAURANTS));
    const fixture = render({ getCategories: pageOf([RESTAURANTS]), createCategory });
    const element = fixture.nativeElement as HTMLElement;

    buttonNamed(element, 'إضافة تصنيف جديد')?.click();
    fixture.detectChanges();
    const name = element.querySelector('[data-testid="category-name"]') as HTMLInputElement;
    name.value = 'فنادق';
    name.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    (element.querySelector('[data-testid="category-submit"]') as HTMLButtonElement).click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(createCategory).toHaveBeenCalledWith({
      name: 'فنادق',
      kind: 'main',
      parentId: null,
      icon: 'utensils-crossed',
      color: '#0583EC',
    });
    expect(element.querySelector('[role="dialog"]')).toBeNull();
  });

  it('opens the edit dialog filled from the row', () => {
    const fixture = render({ getCategories: pageOf([RESTAURANTS]) });

    openRowMenuItem(fixture, 'تعديل');

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('[role="dialog"] h2')?.textContent?.trim()).toBe('تعديل التصنيف');
    expect((element.querySelector('[data-testid="category-name"]') as HTMLInputElement).value).toBe(
      'مطاعم',
    );
  });

  it('suspends a category after confirming', async () => {
    const setCategoryStatus = vi.fn(() => of(RESTAURANTS));
    const fixture = render({ getCategories: pageOf([RESTAURANTS]), setCategoryStatus });

    openRowMenuItem(fixture, 'تغيير الحالة');
    buttonNamed(fixture.nativeElement, 'تعطيل التصنيف')?.click();
    await fixture.whenStable();

    expect(setCategoryStatus).toHaveBeenCalledWith('m1', 'suspended');
  });

  it('keeps the dialog open and shows the reason when a delete fails', async () => {
    const fixture = render({
      getCategories: pageOf([RESTAURANTS]),
      deleteCategory: () => throwError(() => new Error('تعذر حذف التصنيف')),
    });
    const element = fixture.nativeElement as HTMLElement;

    openRowMenuItem(fixture, 'حذف');
    buttonNamed(element, 'حذف التصنيف')?.click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(element.querySelector('[role="dialog"]')).toBeTruthy();
    expect(element.querySelector('app-toast')?.textContent).toContain('تعذر حذف التصنيف');
  });
});
