import { TestBed } from '@angular/core/testing';
import { CategoryDraft } from '../../models/category-draft';
import { buildCategoryFormCopy } from '../category-dialog-copy';
import { CategoryFormDialog } from './category-form-dialog';

const PARENTS = [
  { value: 'm1', label: 'مطاعم' },
  { value: 'm2', label: 'مقاهي' },
];
const NEW_DRAFT: CategoryDraft = { name: '', kind: 'main', parentId: null, icon: 'utensils' };

function render(mode: 'create' | 'edit', draft: CategoryDraft = NEW_DRAFT) {
  const fixture = TestBed.createComponent(CategoryFormDialog);
  fixture.componentRef.setInput('mode', mode);
  fixture.componentRef.setInput('copy', buildCategoryFormCopy(mode));
  fixture.componentRef.setInput('initialDraft', draft);
  fixture.componentRef.setInput('parentOptions', PARENTS);
  fixture.detectChanges();
  return fixture;
}

function query<T extends Element>(fixture: ReturnType<typeof render>, testId: string): T | null {
  return (fixture.nativeElement as HTMLElement).querySelector<T>(`[data-testid="${testId}"]`);
}

function typeName(fixture: ReturnType<typeof render>, name: string): void {
  const input = query<HTMLInputElement>(fixture, 'category-name')!;
  input.value = name;
  input.dispatchEvent(new Event('input'));
  fixture.detectChanges();
}

function captureSubmits(fixture: ReturnType<typeof render>): CategoryDraft[] {
  const submitted: CategoryDraft[] = [];
  fixture.componentInstance.submitted.subscribe((draft) => submitted.push(draft));
  return submitted;
}

describe('CategoryFormDialog', () => {
  it('opens the add dialog with its title, subtitle, kind picker and icon picker', () => {
    const fixture = render('create');
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('h2')?.textContent?.trim()).toBe('إضافة تصنيف جديد');
    expect(element.textContent).toContain('أضف تصنيفاً رئيسياً أو فرعياً ليظهر ضمن تطبيق MapMob.');
    expect(query<HTMLInputElement>(fixture, 'category-name')?.placeholder).toBe('اسم التصنيف');
    expect(element.querySelector('app-category-kind-picker')).toBeTruthy();
    expect(element.querySelector('app-category-icon-picker')).toBeTruthy();
    expect(query(fixture, 'category-parent')).toBeNull();
    expect(query(fixture, 'category-submit')?.textContent?.trim()).toBe('إضافة التصنيف');
  });

  it('asks for the parent once the sub kind is picked, starting on the first main category', () => {
    const fixture = render('create');

    (fixture.nativeElement.querySelectorAll('input[type="radio"]')[1] as HTMLInputElement).click();
    fixture.detectChanges();

    const parent = query<HTMLSelectElement>(fixture, 'category-parent')!;
    expect(fixture.nativeElement.textContent).toContain('اختر التصنيف الرئيسي التابع له');
    expect(parent.value).toBe('m1');
  });

  it('keeps submit locked until a name is typed', () => {
    const fixture = render('create');
    const submit = query<HTMLButtonElement>(fixture, 'category-submit')!;
    expect(submit.disabled).toBe(true);

    typeName(fixture, '   ');
    expect(submit.disabled).toBe(true);

    typeName(fixture, 'فنادق');
    expect(submit.disabled).toBe(false);
  });

  it('submits a trimmed main category with the picked icon and no parent', () => {
    const fixture = render('create');
    const submitted = captureSubmits(fixture);

    typeName(fixture, '  فنادق ');
    (
      fixture.nativeElement.querySelectorAll(
        'app-category-icon-picker button',
      )[6] as HTMLButtonElement
    ).click();
    fixture.detectChanges();
    query<HTMLButtonElement>(fixture, 'category-submit')!.click();

    expect(submitted).toEqual([{ name: 'فنادق', kind: 'main', parentId: null, icon: 'store' }]);
  });

  it('opens the edit dialog of a sub category without the kind picker', () => {
    const fixture = render('edit', {
      name: 'مطاعم بحرية',
      kind: 'sub',
      parentId: 'm2',
      icon: 'coffee',
    });
    const submitted = captureSubmits(fixture);
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('h2')?.textContent?.trim()).toBe('تعديل التصنيف');
    expect(element.querySelector('app-category-kind-picker')).toBeNull();
    expect(query<HTMLInputElement>(fixture, 'category-name')?.value).toBe('مطاعم بحرية');
    expect(element.textContent).toContain('التصنيف الرئيسي التابع له');

    const parent = query<HTMLSelectElement>(fixture, 'category-parent')!;
    expect(parent.value).toBe('m2');
    parent.value = 'm1';
    parent.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    query<HTMLButtonElement>(fixture, 'category-submit')!.click();

    expect(submitted).toEqual([
      { name: 'مطاعم بحرية', kind: 'sub', parentId: 'm1', icon: 'coffee' },
    ]);
  });

  it('hides the parent field when editing a main category', () => {
    const fixture = render('edit', {
      name: 'مطاعم',
      kind: 'main',
      parentId: null,
      icon: 'utensils',
    });

    expect(query(fixture, 'category-parent')).toBeNull();
    expect(query(fixture, 'category-submit')?.textContent?.trim()).toBe('حفظ التغييرات');
  });

  it('locks submit for a sub category when no main category exists', () => {
    const fixture = render('create', { ...NEW_DRAFT, kind: 'sub' });
    fixture.componentRef.setInput('parentOptions', []);
    typeName(fixture, 'مخابز');

    expect(query<HTMLButtonElement>(fixture, 'category-submit')?.disabled).toBe(true);
  });

  it('locks submit while saving', () => {
    const fixture = render('create');
    typeName(fixture, 'فنادق');
    fixture.componentRef.setInput('isBusy', true);
    fixture.detectChanges();

    expect(query<HTMLButtonElement>(fixture, 'category-submit')?.disabled).toBe(true);
  });

  it('cancels from the close button, the cancel button, the backdrop and Escape', () => {
    const fixture = render('create');
    const cancelled = vi.fn();
    fixture.componentInstance.cancelled.subscribe(cancelled);

    query<HTMLButtonElement>(fixture, 'category-close')!.click();
    query<HTMLButtonElement>(fixture, 'category-cancel')!.click();
    (fixture.nativeElement.querySelector('[role="dialog"]') as HTMLElement).click();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

    expect(cancelled).toHaveBeenCalledTimes(4);
  });
});
