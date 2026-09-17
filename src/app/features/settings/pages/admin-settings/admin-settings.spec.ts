import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AdminsRepository } from '../../data/admins.repository';
import { RolesRepository } from '../../data/roles.repository';
import { buildAdminRole, buildDashboardAdmin } from '../../testing/settings-fixture';
import { AdminSettings } from './admin-settings';

function render() {
  TestBed.configureTestingModule({
    providers: [
      {
        provide: AdminsRepository,
        useValue: {
          getAdmins: () => of([buildDashboardAdmin()]),
          inviteAdmin: (invitation: { fullName: string; email: string; roleId: string }) =>
            of(buildDashboardAdmin({ id: 'admin-9', ...invitation, lastSignInOn: null })),
        },
      },
      { provide: RolesRepository, useValue: { getRoles: () => of([buildAdminRole()]) } },
    ],
  });
  const fixture = TestBed.createComponent(AdminSettings);
  fixture.detectChanges();
  return { fixture, element: fixture.nativeElement as HTMLElement };
}

function type(element: HTMLElement, id: string, value: string): void {
  const field = element.querySelector(`#${id}`) as HTMLInputElement;
  field.value = value;
  field.dispatchEvent(new Event('input'));
}

describe('AdminSettings', () => {
  it('heads the section with its own title and add button', () => {
    const { element } = render();

    expect(element.querySelector('h2')?.textContent?.trim()).toBe('مشرفوا لوحة التحكم');
    expect(element.querySelector('app-settings-add-button')?.textContent?.trim()).toBe(
      'إضافة مشرف جديد',
    );
    expect(element.querySelectorAll('tbody tr')).toHaveLength(1);
  });

  it('invites an admin through the dialog and confirms it', async () => {
    const { fixture, element } = render();

    (element.querySelector('app-settings-add-button button') as HTMLButtonElement).click();
    fixture.detectChanges();
    type(element, 'admin-full-name', 'يوسف محمد');
    type(element, 'admin-email', 'yousef@mapmob.com');
    (
      element.querySelector('app-admin-invite-dialog button[type="submit"]') as HTMLButtonElement
    ).click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(element.querySelector('app-admin-invite-dialog')).toBeNull();
    expect(element.querySelectorAll('tbody tr')).toHaveLength(2);
    expect(element.querySelector('app-toast')?.textContent).toContain('تمت إضافة المشرف');
  });
});
