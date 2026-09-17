import { TestBed } from '@angular/core/testing';
import { RoleDialogState } from '../../models/role-dialog-state';
import { RoleDraft } from '../../models/role-draft';
import { NEW_ROLE_GRANTS } from '../../state/role-grants';
import { buildAdminRole } from '../../testing/settings-fixture';
import { RoleDialog } from './role-dialog';

function render(dialog: RoleDialogState) {
  const fixture = TestBed.createComponent(RoleDialog);
  fixture.componentRef.setInput('dialog', dialog);
  const saved: RoleDraft[] = [];
  let closes = 0;
  fixture.componentInstance.saved.subscribe((draft) => saved.push(draft));
  fixture.componentInstance.closed.subscribe(() => closes++);
  fixture.detectChanges();
  return { fixture, element: fixture.nativeElement as HTMLElement, saved, closes: () => closes };
}

function buttonNamed(element: HTMLElement, label: string): HTMLButtonElement {
  return Array.from(element.querySelectorAll('button')).find(
    (button) => button.textContent?.trim() === label,
  ) as HTMLButtonElement;
}

function type(element: HTMLElement, selector: string, value: string): void {
  const field = element.querySelector(selector) as HTMLInputElement;
  field.value = value;
  field.dispatchEvent(new Event('input'));
}

describe('RoleDialog', () => {
  it('opens a new role with the design copy, active and with the suggested boxes', () => {
    const { element, saved } = render({ mode: 'add' });

    expect(element.querySelector('h2')?.textContent?.trim()).toBe('إضافة دور جديد');
    expect(element.textContent).toContain('تحديد اسم الدور وصلاحيات الوصول لكل قسم في المنصة');
    expect(element.querySelector('button[role="switch"]')?.getAttribute('aria-checked')).toBe(
      'true',
    );
    expect(element.textContent).toContain('تفعيل الدور فور الإنشاء');

    type(element, '#role-name', ' مشرف عمليات ');
    type(element, '#role-description', 'متابعة العمليات');
    buttonNamed(element, 'إضافة الدور').click();

    expect(saved).toEqual([
      {
        name: 'مشرف عمليات',
        description: 'متابعة العمليات',
        isActive: true,
        grants: NEW_ROLE_GRANTS,
      },
    ]);
  });

  it('ticks everything or nothing from the matrix buttons', () => {
    const { fixture, element, saved } = render({ mode: 'add' });
    type(element, '#role-name', 'دور');

    buttonNamed(element, 'تحديد كل الصلاحيات').click();
    fixture.detectChanges();
    expect(element.querySelectorAll('tbody input:checked')).toHaveLength(45);

    buttonNamed(element, 'إلغاء تحديد الكل').click();
    fixture.detectChanges();
    buttonNamed(element, 'إضافة الدور').click();
    fixture.detectChanges();

    expect(saved).toEqual([]);
    expect(element.textContent).toContain('اختر صلاحية واحدة على الأقل');
  });

  it('needs a role name', () => {
    const { fixture, element, saved } = render({ mode: 'add' });

    buttonNamed(element, 'إضافة الدور').click();
    fixture.detectChanges();

    expect(saved).toEqual([]);
    expect(element.textContent).toContain('اكتب اسم الدور');
  });

  it('edits a role with its values, including a switched-off status', () => {
    const role = buildAdminRole({ isActive: false, grants: ['home:view'] });
    const { fixture, element, saved } = render({ mode: 'edit', role });

    expect(element.querySelector('h2')?.textContent?.trim()).toBe('تعديل الدور');

    expect(element.textContent).toContain('الدور مفعّل');
    expect((element.querySelector('#role-name') as HTMLInputElement).value).toBe('مشرف');
    (element.querySelector('button[role="switch"]') as HTMLButtonElement).click();
    fixture.detectChanges();
    buttonNamed(element, 'حفظ التغييرات').click();

    expect(saved).toEqual([
      { name: 'مشرف', description: role.description, isActive: true, grants: ['home:view'] },
    ]);
  });

  it('shows the full access role read-only, with only a close button', () => {
    const role = buildAdminRole({ name: 'مدير النظام', isFullAccess: true, grants: [] });
    const { element, closes } = render({ mode: 'view', role });

    expect(element.querySelector('h2')?.textContent?.trim()).toBe('صلاحيات مدير النظام');
    expect(element.querySelectorAll('tbody input:checked')).toHaveLength(45);
    expect((element.querySelector('#role-name') as HTMLInputElement).disabled).toBe(true);
    expect(element.querySelector('button[type="submit"]')).toBeNull();
    expect(buttonNamed(element, 'تحديد كل الصلاحيات')).toBeUndefined();

    buttonNamed(element, 'إغلاق').click();
    expect(closes()).toBe(1);
  });
});
