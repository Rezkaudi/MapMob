import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Skeleton } from './skeleton';

@Component({
  imports: [Skeleton],
  template: `<app-skeleton />`,
})
class HostComponent {}

@Component({
  imports: [Skeleton],
  template: `<app-skeleton width="120px" height="24px" shape="circle" />`,
})
class HostShapedComponent {}

describe('Skeleton', () => {
  it('is hidden from assistive tech', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement.querySelector('app-skeleton');
    expect(element.getAttribute('aria-hidden')).toBe('true');
  });

  it('fills its row by default', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement.querySelector('app-skeleton');
    expect(element.style.width).toBe('100%');
    expect(element.className).toContain('app-skeleton');
  });

  it('takes the given size and shape', () => {
    const fixture = TestBed.createComponent(HostShapedComponent);
    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement.querySelector('app-skeleton');
    expect(element.style.width).toBe('120px');
    expect(element.style.height).toBe('24px');
    expect(element.className).toContain('rounded-full');
  });
});
