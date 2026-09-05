import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TableEmpty } from './table-empty';

@Component({
  imports: [TableEmpty],
  template: `<app-table-empty />`,
})
class HostComponent {}

@Component({
  imports: [TableEmpty],
  template: `<app-table-empty message="لا توجد نتائج مطابقة لبحثك" />`,
})
class HostWithMessageComponent {}

describe('TableEmpty', () => {
  it('says there is nothing to show', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('لا توجد بيانات لعرضها');
  });

  it('takes a message of its own', () => {
    const fixture = TestBed.createComponent(HostWithMessageComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('لا توجد نتائج مطابقة لبحثك');
  });
});
