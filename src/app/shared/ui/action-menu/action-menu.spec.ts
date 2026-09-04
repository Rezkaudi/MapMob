import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActionMenu } from './action-menu';

@Component({
  imports: [ActionMenu],
  template: `
    <app-action-menu>
      <button type="button" class="item">تعديل</button>
    </app-action-menu>
  `,
})
class HostComponent {}

describe('ActionMenu', () => {
  it('hides the menu items until the trigger is clicked', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.item')).toBeFalsy();

    fixture.debugElement.query(By.css('button[aria-haspopup]')).nativeElement.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.item')).toBeTruthy();
  });
});
