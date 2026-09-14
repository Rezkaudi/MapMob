import { TestBed } from '@angular/core/testing';
import { buildCategory } from '../../testing/category-fixture';
import { CategoryDialogs } from './category-dialogs';

const SEAFOOD = buildCategory({
  id: 's1',
  name: 'مطاعم بحرية',
  kind: 'sub',
  parentId: 'm1',
  icon: 'coffee',
});
const PARENTS = [{ value: 'm1', label: 'مطاعم' }];

function render(request: unknown) {
  const fixture = TestBed.createComponent(CategoryDialogs);
  fixture.componentRef.setInput('request', request);
  fixture.componentRef.setInput('parentOptions', PARENTS);
  fixture.detectChanges();
  return fixture;
}

describe('CategoryDialogs', () => {
  it('shows nothing without a request', () => {
    expect(render(null).nativeElement.querySelector('[role="dialog"]')).toBeNull();
  });

  it('opens an empty add form for a main category with the utensils icon', () => {
    const element = render({ type: 'form', mode: 'create', entry: null })
      .nativeElement as HTMLElement;

    expect(element.querySelector('h2')?.textContent?.trim()).toBe('إضافة تصنيف جديد');
    expect((element.querySelector('[data-testid="category-name"]') as HTMLInputElement).value).toBe(
      '',
    );
    expect(
      element
        .querySelector('app-category-icon-picker button[aria-pressed="true"]')
        ?.getAttribute('aria-label'),
    ).toBe('مطاعم');
  });

  it('fills the edit form from the category', () => {
    const element = render({ type: 'form', mode: 'edit', entry: SEAFOOD })
      .nativeElement as HTMLElement;

    expect(element.querySelector('h2')?.textContent?.trim()).toBe('تعديل التصنيف');
    expect((element.querySelector('[data-testid="category-name"]') as HTMLInputElement).value).toBe(
      'مطاعم بحرية',
    );
    expect(element.querySelector('[data-testid="category-parent"]')).toBeTruthy();
  });

  it('asks to confirm a status change', () => {
    const element = render({ type: 'confirm', action: 'suspend', entry: SEAFOOD })
      .nativeElement as HTMLElement;

    expect(element.querySelector('h2')?.textContent?.trim()).toBe('تعطيل التصنيف');
    expect(element.textContent).toContain('هل أنت متأكد من تعطيل تصنيف مطاعم بحرية؟');
  });

  it('passes the submitted draft, the confirmation and the close on', () => {
    const fixture = render({ type: 'confirm', action: 'delete', entry: SEAFOOD });
    const events: string[] = [];
    fixture.componentInstance.confirmed.subscribe(() => events.push('confirmed'));
    fixture.componentInstance.closed.subscribe(() => events.push('closed'));
    const buttons = Array.from((fixture.nativeElement as HTMLElement).querySelectorAll('button'));

    buttons.find((button) => button.textContent?.trim() === 'حذف التصنيف')!.click();
    buttons.find((button) => button.textContent?.trim() === 'إلغاء')!.click();

    expect(events).toEqual(['confirmed', 'closed']);
  });
});
