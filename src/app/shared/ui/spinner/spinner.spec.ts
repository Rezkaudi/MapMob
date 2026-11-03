import { Component } from '@angular/core';
import { PageLock } from '../../../core/page-lock/page-lock';
import { TestBed } from '@angular/core/testing';
import { Spinner } from './spinner';

@Component({
  imports: [Spinner],
  template: `<app-spinner />`,
})
class HostComponent {}

@Component({
  imports: [Spinner],
  template: `<app-spinner [size]="32" label="جاري الحفظ" />`,
})
class HostWithLabelComponent {}

describe('Spinner', () => {
  it('tells assistive tech that something is loading', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const status: HTMLElement = fixture.nativeElement.querySelector('[role="status"]');
    expect(status.getAttribute('aria-label')).toBe('جاري التحميل');
  });

  it('spins a circle of the asked-for size', () => {
    const fixture = TestBed.createComponent(HostWithLabelComponent);
    fixture.detectChanges();

    const circle: HTMLElement = fixture.nativeElement.querySelector('[data-role="circle"]');
    expect(circle.style.width).toBe('32px');
    expect(circle.style.height).toBe('32px');
    expect(circle.className).toContain('animate-spin');
  });

  it('centres itself next to the text beside it', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const host: HTMLElement = fixture.nativeElement.querySelector('app-spinner');
    expect(host.className).toContain('inline-flex');
    expect(host.className).toContain('items-center');
  });

  it('uses the given label', () => {
    const fixture = TestBed.createComponent(HostWithLabelComponent);
    fixture.detectChanges();

    const status: HTMLElement = fixture.nativeElement.querySelector('[role="status"]');
    expect(status.getAttribute('aria-label')).toBe('جاري الحفظ');
  });
});

describe('Spinner and the page lock', () => {
  it('locks the page while it is on screen and frees it once gone', () => {
    const pageLock = TestBed.inject(PageLock);
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    expect(pageLock.isBusy()).toBe(true);

    fixture.destroy();

    expect(pageLock.isBusy()).toBe(false);
  });
});
