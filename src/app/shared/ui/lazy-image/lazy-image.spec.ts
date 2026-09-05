import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { LazyImage } from './lazy-image';

@Component({
  imports: [LazyImage],
  template: `<app-lazy-image src="logo.png" alt="شعار" imageClass="size-full object-cover">
    <span data-role="fallback">ص</span>
  </app-lazy-image>`,
})
class HostComponent {}

function imageOf(fixture: { nativeElement: HTMLElement }): HTMLImageElement {
  return fixture.nativeElement.querySelector('img') as HTMLImageElement;
}

describe('LazyImage', () => {
  it('covers the picture with a placeholder until it loads', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('app-skeleton')).toBeTruthy();
    expect(imageOf(fixture).className).toContain('opacity-0');
  });

  it('shows the picture once it has loaded', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    imageOf(fixture).dispatchEvent(new Event('load'));
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('app-skeleton')).toBeNull();
    expect(imageOf(fixture).className).not.toContain('opacity-0');
  });

  it('falls back to the projected content when the picture fails', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    imageOf(fixture).dispatchEvent(new Event('error'));
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('img')).toBeNull();
    expect(fixture.nativeElement.querySelector('app-skeleton')).toBeNull();
    expect(fixture.nativeElement.querySelector('[data-role="fallback"]')).toBeTruthy();
  });

  it('passes the given classes to the picture', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const classes = imageOf(fixture).classList;
    expect(classes.contains('size-full')).toBe(true);
    expect(classes.contains('object-cover')).toBe(true);
  });
});
