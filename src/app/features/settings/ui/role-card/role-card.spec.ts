import { TestBed } from '@angular/core/testing';
import { AdminRole } from '../../models/admin-role';
import { buildAdminRole } from '../../testing/settings-fixture';
import { RoleCard } from './role-card';

function render(role: AdminRole) {
  const fixture = TestBed.createComponent(RoleCard);
  fixture.componentRef.setInput('role', role);
  const opened: AdminRole[] = [];
  const deleted: AdminRole[] = [];
  fixture.componentInstance.open.subscribe((value) => opened.push(value));
  fixture.componentInstance.remove.subscribe((value) => deleted.push(value));
  fixture.detectChanges();
  return { element: fixture.nativeElement as HTMLElement, opened, deleted };
}

const text = (element: HTMLElement, role: string) =>
  element.querySelector(`[data-role="${role}"]`)?.textContent?.trim();

describe('RoleCard', () => {
  it('shows the role name, English name, description and counts', () => {
    const { element } = render(
      buildAdminRole({ grants: Array(32).fill('home:view'), adminCount: 5 }),
    );

    expect(element.querySelector('h3')?.textContent?.trim()).toBe('مشرف');
    expect(text(element, 'english-name')).toBe('(Admin)');
    expect(text(element, 'role-description')).toBe(
      'صلاحيات إدارية عامة لإدارة الأماكن والعروض والاشتراكات والمستخدمين',
    );
    expect(text(element, 'admin-count')).toBe('5 مشرفين');
    expect(text(element, 'permission-count')).toBe('32 صلاحية');
  });

  it('leaves the English name out when the role has none', () => {
    const { element } = render(buildAdminRole({ englishName: '' }));

    expect(element.querySelector('[data-role="english-name"]')).toBeNull();
  });

  it('tints the tile by the role icon', () => {
    expect(
      render(buildAdminRole()).element.querySelector('[data-role="role-icon"]')?.classList,
    ).toContain('bg-[#d4e3ff]');
    expect(
      render(buildAdminRole({ icon: 'headset' })).element.querySelector('[data-role="role-icon"]')
        ?.classList,
    ).toContain('text-status-success');
  });

  it('offers editing and deleting on a custom role', () => {
    const role = buildAdminRole();
    const { element, opened, deleted } = render(role);
    const buttons = Array.from(element.querySelectorAll('button'));

    expect(buttons.map((button) => button.textContent?.trim())).toEqual(['تعديل', 'حذف']);
    buttons[0].click();
    buttons[1].click();

    expect(opened).toEqual([role]);
    expect(deleted).toEqual([role]);
  });

  it('offers viewing the permissions of the full access role', () => {
    const { element } = render(buildAdminRole({ isFullAccess: true, grants: [], adminCount: 1 }));

    expect(
      Array.from(element.querySelectorAll('button')).map((button) => button.textContent?.trim()),
    ).toEqual(['عرض الصلاحيات', 'حذف']);
    expect(text(element, 'admin-count')).toBe('مشرف واحد فقط');
    expect(text(element, 'permission-count')).toBe('45 صلاحية (كامل الصلاحيات)');
  });
});
