import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActionMenu } from './action-menu';

@Component({
  imports: [ActionMenu],
  // The clipping wrapper is what the tables put around the menu.
  template: `
    <div style="overflow: hidden">
      <app-action-menu>
        <button type="button" class="item">تعديل</button>
      </app-action-menu>
    </div>
  `,
})
class HostComponent {}

function open() {
  const fixture = TestBed.createComponent(HostComponent);
  fixture.detectChanges();
  fixture.debugElement.query(By.css('button[aria-haspopup]')).nativeElement.click();
  fixture.detectChanges();
  return fixture;
}

function panelOf(fixture: ReturnType<typeof open>): HTMLElement {
  return fixture.nativeElement.querySelector('[data-testid="action-menu-panel"]');
}

function stubTriggerRect(fixture: ReturnType<typeof open>, rect: Partial<DOMRect>) {
  const trigger: HTMLElement = fixture.nativeElement.querySelector('button[aria-haspopup]');
  trigger.getBoundingClientRect = () => ({ top: 0, bottom: 0, left: 0, ...rect }) as DOMRect;
}

describe('ActionMenu', () => {
  it('hides the menu items until the trigger is clicked', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.item')).toBeFalsy();

    fixture.debugElement.query(By.css('button[aria-haspopup]')).nativeElement.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.item')).toBeTruthy();
  });

  it('floats the panel so an overflow-hidden ancestor cannot clip it', () => {
    expect(panelOf(open()).style.position).toBe('fixed');
  });

  it('hangs the panel under the trigger', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    stubTriggerRect(fixture, { bottom: 300, left: 120 });
    fixture.debugElement.query(By.css('button[aria-haspopup]')).nativeElement.click();
    fixture.detectChanges();

    const panel = panelOf(fixture);
    expect(panel.style.top).toBe('304px');
    expect(panel.style.left).toBe('120px');
  });

  it('flips the panel above the trigger when there is no room below', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    // A trigger near the bottom of an 800px-tall viewport.
    Object.defineProperty(window, 'innerHeight', { value: 800, configurable: true });
    stubTriggerRect(fixture, { top: 760, bottom: 780, left: 40 });
    fixture.debugElement.query(By.css('button[aria-haspopup]')).nativeElement.click();
    fixture.detectChanges();

    expect(panelOf(fixture).style.bottom).toBe('44px');
    expect(panelOf(fixture).style.top).toBe('');
  });

  it('closes when the page scrolls, so the panel never floats away from its row', () => {
    const fixture = open();
    expect(panelOf(fixture)).toBeTruthy();

    document.dispatchEvent(new Event('scroll', { bubbles: true }));
    fixture.detectChanges();

    expect(panelOf(fixture)).toBeFalsy();
  });
});
