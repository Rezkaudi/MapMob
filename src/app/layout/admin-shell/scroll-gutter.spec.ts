import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ScrollGutter, SCROLL_GUTTER_VARIABLE } from './scroll-gutter';

@Component({ imports: [ScrollGutter], template: `<div appScrollGutter></div>` })
class HostComponent {}

function fakeWidths(element: HTMLElement, offsetWidth: number, clientWidth: number): void {
  Object.defineProperty(element, 'offsetWidth', { value: offsetWidth, configurable: true });
  Object.defineProperty(element, 'clientWidth', { value: clientWidth, configurable: true });
}

function publishedGutter(): string {
  return document.documentElement.style.getPropertyValue(SCROLL_GUTTER_VARIABLE);
}

describe('ScrollGutter', () => {
  afterEach(() => document.documentElement.style.removeProperty(SCROLL_GUTTER_VARIABLE));

  it('publishes the width the scrollbar takes from the content', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fakeWidths(fixture.nativeElement.querySelector('div')!, 1160, 1145);
    fixture.detectChanges();

    expect(publishedGutter()).toBe('15px');
  });

  it('publishes nothing to add when the scrollbar floats over the content', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fakeWidths(fixture.nativeElement.querySelector('div')!, 1160, 1160);
    fixture.detectChanges();

    expect(publishedGutter()).toBe('0px');
  });

  it('measures again when the window resizes', () => {
    const fixture = TestBed.createComponent(HostComponent);
    const scroller: HTMLElement = fixture.nativeElement.querySelector('div')!;
    fakeWidths(scroller, 1160, 1145);
    fixture.detectChanges();

    fakeWidths(scroller, 900, 900);
    window.dispatchEvent(new Event('resize'));

    expect(publishedGutter()).toBe('0px');
  });
});
