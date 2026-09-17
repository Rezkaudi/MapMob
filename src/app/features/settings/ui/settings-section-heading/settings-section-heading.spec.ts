import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SettingsSectionHeading } from './settings-section-heading';

@Component({
  imports: [SettingsSectionHeading],
  template: `
    <app-settings-section-heading title="إعدادات الدفع" description="التحكم في بوابات الدفع">
      <button sectionHeadingAction type="button">إضافة</button>
    </app-settings-section-heading>
  `,
})
class HostWithAction {}

describe('SettingsSectionHeading', () => {
  it('shows the section title and its description', () => {
    const fixture = TestBed.createComponent(SettingsSectionHeading);
    fixture.componentRef.setInput('title', 'إعدادات الحساب');
    fixture.componentRef.setInput('description', 'إدارة بيانات حسابك');
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('h2')?.textContent?.trim()).toBe('إعدادات الحساب');
    expect(element.querySelector('p')?.textContent?.trim()).toBe('إدارة بيانات حسابك');
  });

  it('places the section action after the title block, so it sits on the left', () => {
    const fixture = TestBed.createComponent(HostWithAction);
    fixture.detectChanges();
    const row = (fixture.nativeElement as HTMLElement).querySelector(
      'app-settings-section-heading > div',
    );

    expect(row?.lastElementChild?.textContent?.trim()).toBe('إضافة');
  });
});
