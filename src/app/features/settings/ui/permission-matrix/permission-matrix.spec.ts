import { TestBed } from '@angular/core/testing';
import { PermissionGrant } from '../../models/permission-grant';
import { PermissionMatrix } from './permission-matrix';

function render(grants: readonly PermissionGrant[], isReadOnly = false) {
  const fixture = TestBed.createComponent(PermissionMatrix);
  fixture.componentRef.setInput('grants', grants);
  fixture.componentRef.setInput('isReadOnly', isReadOnly);
  const toggled: PermissionGrant[] = [];
  fixture.componentInstance.grantToggled.subscribe((grant) => toggled.push(grant));
  fixture.detectChanges();
  return { element: fixture.nativeElement as HTMLElement, toggled };
}

describe('PermissionMatrix', () => {
  it('heads the section column and the four actions right to left', () => {
    const { element } = render([]);

    expect(
      Array.from(element.querySelectorAll('thead th')).map((cell) => cell.textContent?.trim()),
    ).toEqual(['القسم / الوحدة', 'عرض', 'إضافة', 'تعديل', 'حذف']);
    expect(element.querySelectorAll('tbody tr')).toHaveLength(14);
  });

  it('draws a box for each action a section has and a dash for the rest', () => {
    const { element } = render(['home:view']);
    const homeRow = element.querySelector('tbody tr') as HTMLElement;

    const home = homeRow.querySelector(
      'input[aria-label="عرض: الرئيسية والإحصائيات العامة"]',
    ) as HTMLInputElement;
    expect(home.checked).toBe(true);
    expect(homeRow.querySelectorAll('input')).toHaveLength(1);
    expect(homeRow.querySelectorAll('[data-role="no-permission"]')).toHaveLength(3);
  });

  it('reports the box that was ticked', () => {
    const { element, toggled } = render([]);

    (
      element.querySelector('input[aria-label="حذف: الشركات والمتاجر"]') as HTMLInputElement
    ).click();

    expect(toggled).toEqual(['places:delete']);
  });

  it('locks every box when read-only, keeping the ticks in colour', () => {
    const { element, toggled } = render(['places:view'], true);
    const boxes = Array.from(element.querySelectorAll('input'));

    expect(boxes.every((box) => box.getAttribute('aria-disabled') === 'true')).toBe(true);
    expect(boxes.some((box) => box.disabled)).toBe(false);
    const placesView = element.querySelector(
      'input[aria-label="عرض: الشركات والمتاجر"]',
    ) as HTMLInputElement;
    placesView.click();

    expect(placesView.checked).toBe(true);
    expect(toggled).toEqual([]);
  });
});
