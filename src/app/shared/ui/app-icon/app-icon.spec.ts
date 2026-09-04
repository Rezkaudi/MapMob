import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AppIcon } from './app-icon';

@Component({
  imports: [AppIcon],
  template: `<app-icon name="home" [size]="20" />`,
})
class HostComponent {}

describe('AppIcon', () => {
  it('masks the matching Figma asset so the glyph can take the current colour', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const span = fixture.nativeElement.querySelector('span') as HTMLElement;
    expect(span.style.maskImage).toContain('assets/icons/home.svg');
    expect(span.style.width).toBe('20px');
    expect(span.style.height).toBe('20px');
  });
});
