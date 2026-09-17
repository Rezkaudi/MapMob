import { TestBed } from '@angular/core/testing';
import { DashboardAdmin } from '../../models/dashboard-admin';
import { buildDashboardAdmin } from '../../testing/settings-fixture';
import { AdminTable } from './admin-table';

function render(admins: readonly DashboardAdmin[], isLoading = false) {
  const fixture = TestBed.createComponent(AdminTable);
  fixture.componentRef.setInput('admins', admins);
  fixture.componentRef.setInput('isLoading', isLoading);
  fixture.detectChanges();
  return fixture.nativeElement as HTMLElement;
}

const cellTexts = (row: Element) =>
  Array.from(row.children).map((cell) => cell.textContent?.trim());

describe('AdminTable', () => {
  it('heads the columns right to left as the design does', () => {
    expect(cellTexts(render([]).querySelector('thead tr') as Element)).toEqual([
      'المشرف',
      'البريد الالكتروني',
      'الدور',
      'الحالة',
      'آخر تسجيل دخول',
    ]);
  });

  it('writes each admin with the role pill, status pill and last sign-in date', () => {
    const element = render([
      buildDashboardAdmin(),
      buildDashboardAdmin({
        id: 'admin-3',
        fullName: 'يوسف أحمد',
        email: 'yousef@mapmob.com',
        roleName: 'مسؤول الدعم',
        status: 'suspended',
        lastSignInOn: null,
      }),
    ]);

    const rows = element.querySelectorAll('tbody tr');
    expect(cellTexts(rows[0])).toEqual([
      'مريم محمد',
      'maryam.m@mapmob.com',
      'مشرف',
      'نشط',
      '26 يناير 2024',
    ]);
    expect(cellTexts(rows[1])).toEqual([
      'يوسف أحمد',
      'yousef@mapmob.com',
      'مسؤول الدعم',
      'معطل',
      'لم يسجل الدخول بعد',
    ]);
  });

  it('says when there are no admins, and not while loading', () => {
    expect(render([]).textContent).toContain('لا يوجد مشرفون بعد');
    expect(render([], true).textContent).not.toContain('لا يوجد مشرفون بعد');
  });
});
