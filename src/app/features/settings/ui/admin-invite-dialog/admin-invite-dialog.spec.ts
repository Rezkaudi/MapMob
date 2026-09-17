import { TestBed } from '@angular/core/testing';
import { AdminInvitation } from '../../models/admin-invitation';
import { buildAdminRole } from '../../testing/settings-fixture';
import { AdminInviteDialog } from './admin-invite-dialog';

const ROLES = [
  buildAdminRole({ id: 'role-1', name: 'مدير النظام', englishName: 'Super Admin' }),
  buildAdminRole({ id: 'role-2', name: 'مشرف عام', englishName: 'Admin' }),
];

function render() {
  const fixture = TestBed.createComponent(AdminInviteDialog);
  fixture.componentRef.setInput('roles', ROLES);
  fixture.componentRef.setInput('suggestedRoleId', 'role-2');
  const invited: AdminInvitation[] = [];
  fixture.componentInstance.invited.subscribe((invitation) => invited.push(invitation));
  fixture.detectChanges();
  return { fixture, element: fixture.nativeElement as HTMLElement, invited };
}

function type(element: HTMLElement, id: string, value: string): void {
  const field = element.querySelector(`#${id}`) as HTMLInputElement;
  field.value = value;
  field.dispatchEvent(new Event('input'));
}

function submit(element: HTMLElement): void {
  (element.querySelector('button[type="submit"]') as HTMLButtonElement).click();
}

describe('AdminInviteDialog', () => {
  it('uses the design copy and offers the roles with their English names', () => {
    const { element } = render();
    const role = element.querySelector('#admin-role') as HTMLSelectElement;

    expect(element.querySelector('h2')?.textContent?.trim()).toBe('إضافة مشرف جديد');
    expect(element.textContent).toContain(
      'أدخل بيانات المشرف وسيتم إرسال رابط تفعيل الحساب وتعيين كلمة السر عبر البريد الالكتروني',
    );
    expect(Array.from(role.options).map((option) => option.textContent?.trim())).toEqual([
      'مدير النظام (Super Admin)',
      'مشرف عام (Admin)',
    ]);
    expect(role.selectedOptions[0].textContent?.trim()).toBe('مشرف عام (Admin)');
    expect((element.querySelector('#admin-full-name') as HTMLInputElement).placeholder).toBe(
      'مثال: يوسف محمد',
    );
  });

  it('sends the invitation with the trimmed name and email', () => {
    const { element, invited } = render();

    type(element, 'admin-full-name', ' يوسف محمد ');
    type(element, 'admin-email', ' yousef@mapmob.com ');
    submit(element);

    expect(invited).toEqual([
      { fullName: 'يوسف محمد', email: 'yousef@mapmob.com', roleId: 'role-2' },
    ]);
  });

  it('needs a name and a valid email', () => {
    const { fixture, element, invited } = render();

    type(element, 'admin-email', 'yousef@');
    submit(element);
    fixture.detectChanges();

    expect(invited).toEqual([]);
    expect(element.textContent).toContain('اكتب اسم المشرف بالكامل');
    expect(element.textContent).toContain('اكتب بريداً إلكترونياً صحيحاً');
  });
});
