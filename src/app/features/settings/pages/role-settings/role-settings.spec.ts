import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { RolesRepository } from '../../data/roles.repository';
import { buildAdminRole } from '../../testing/settings-fixture';
import { RoleSettings } from './role-settings';

const ROLES = [
  buildAdminRole({ id: 'role-1', name: 'مدير النظام', isFullAccess: true }),
  buildAdminRole(),
];

function render(overrides: Partial<RolesRepository> = {}) {
  TestBed.configureTestingModule({
    providers: [
      {
        provide: RolesRepository,
        useValue: {
          getRoles: () => of(ROLES),
          addRole: () => of(buildAdminRole({ id: 'role-3' })),
          deleteRole: () => of(undefined),
          ...overrides,
        },
      },
    ],
  });
  const fixture = TestBed.createComponent(RoleSettings);
  fixture.detectChanges();
  return { fixture, element: fixture.nativeElement as HTMLElement };
}

function buttonNamed(root: ParentNode, label: string): HTMLButtonElement {
  return Array.from(root.querySelectorAll('button')).find(
    (button) => button.textContent?.trim() === label,
  ) as HTMLButtonElement;
}

async function settle(fixture: { whenStable(): Promise<unknown>; detectChanges(): void }) {
  await fixture.whenStable();
  fixture.detectChanges();
}

describe('RoleSettings', () => {
  it('heads the section and shows a card per role', () => {
    const { element } = render();

    expect(element.querySelector('h2')?.textContent?.trim()).toBe('الأدوار و الصلاحيات');
    expect(element.textContent).toContain('إدارة أدوار المشرفين وتحديد الصلاحيات المتاحة لكل دور.');
    expect(element.querySelectorAll('app-role-card')).toHaveLength(2);
  });

  it('opens the add dialog from the heading button', () => {
    const { fixture, element } = render();

    (element.querySelector('app-settings-add-button button') as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(element.querySelector('app-role-dialog h2')?.textContent?.trim()).toBe('إضافة دور جديد');
  });

  it('deletes a role after the confirmation', async () => {
    const { fixture, element } = render();

    buttonNamed(element.querySelectorAll('app-role-card')[1], 'حذف').click();
    fixture.detectChanges();
    const confirm = element.querySelector('app-confirm-action-dialog') as HTMLElement;
    expect(confirm.textContent).toContain('حذف الدور؟');
    buttonNamed(confirm, 'حذف الدور').click();
    await settle(fixture);

    expect(element.querySelectorAll('app-role-card')).toHaveLength(1);
    expect(element.querySelector('app-toast')?.textContent).toContain('تم حذف الدور');
  });

  it('explains why a role could not be deleted', async () => {
    const { fixture, element } = render({
      deleteRole: () => throwError(() => new Error('لا يمكن حذف دور مرتبط بمشرفين')),
    });

    buttonNamed(element.querySelectorAll('app-role-card')[1], 'حذف').click();
    fixture.detectChanges();
    buttonNamed(
      element.querySelector('app-confirm-action-dialog') as HTMLElement,
      'حذف الدور',
    ).click();
    await settle(fixture);

    const toast = element.querySelector('app-toast');
    expect(toast?.textContent).toContain('تعذر حذف الدور');
    expect(toast?.textContent).toContain('لا يمكن حذف دور مرتبط بمشرفين');
  });
});
