import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Avatar } from './avatar';

@Component({
  imports: [Avatar],
  template: `<app-avatar name="أحمد جمال" />`,
})
class HostComponent {}

describe('Avatar', () => {
  it('falls back to the first two initials when there is no image', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent.trim()).toBe('أح');
  });
});
