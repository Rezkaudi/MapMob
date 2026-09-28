import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AuthFormFrame } from './auth-form-frame';

@Component({
  imports: [AuthFormFrame],
  template: `<app-auth-form-frame><p id="projected">form</p></app-auth-form-frame>`,
})
class HostPage {}

describe('AuthFormFrame', () => {
  it('draws the brand panel first, so RTL pins it to the right edge', () => {
    const fixture = TestBed.createComponent(HostPage);
    fixture.detectChanges();

    const layout: HTMLElement = fixture.nativeElement.querySelector('app-auth-form-frame > div');
    expect(layout.firstElementChild!.tagName).toBe('APP-AUTH-BRAND-PANEL');
  });

  it('puts the page content in the 382px form column', () => {
    const fixture = TestBed.createComponent(HostPage);
    fixture.detectChanges();

    const column: HTMLElement = fixture.nativeElement.querySelector('#projected').parentElement;
    expect(column.classList).toContain('w-[382px]');
  });
});
