import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Badge } from './badge';

@Component({
  imports: [Badge],
  template: `<app-badge tone="success">منشور</app-badge>`,
})
class HostComponent {}

describe('Badge', () => {
  it('renders its content with the tone applied as a class', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const span = fixture.nativeElement.querySelector('span') as HTMLElement;
    expect(span.textContent?.trim()).toBe('منشور');
    expect(span.className).toContain('success');
  });
});
