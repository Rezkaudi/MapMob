import { TestBed } from '@angular/core/testing';
import { PageLock } from '../../core/page-lock/page-lock';
import { PageLockOverlay } from './page-lock-overlay';

function pressKey(): KeyboardEvent {
  const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true });
  document.body.dispatchEvent(event);
  return event;
}

describe('PageLockOverlay', () => {
  let pageLock: PageLock;

  function render() {
    const fixture = TestBed.createComponent(PageLockOverlay);
    fixture.detectChanges();
    return fixture;
  }

  beforeEach(() => {
    pageLock = TestBed.inject(PageLock);
  });

  it('draws nothing while no write runs', () => {
    const fixture = render();

    expect(fixture.nativeElement.querySelector('[data-role="page-lock"]')).toBeNull();
  });

  it('covers the page with a progress bar while a write runs', () => {
    const fixture = render();

    pageLock.start();
    fixture.detectChanges();

    const lock: HTMLElement = fixture.nativeElement.querySelector('[data-role="page-lock"]');
    expect(lock).not.toBeNull();
    expect(lock.querySelector('[role="progressbar"]')).not.toBeNull();
  });

  it('removes the cover once the write ends', () => {
    const fixture = render();
    pageLock.start();
    fixture.detectChanges();

    pageLock.finish();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[data-role="page-lock"]')).toBeNull();
  });

  it('swallows key presses while a write runs', () => {
    render();
    pageLock.start();

    expect(pressKey().defaultPrevented).toBe(true);
  });

  it('lets key presses through when no write runs', () => {
    render();

    expect(pressKey().defaultPrevented).toBe(false);
  });

  it('stops listening once it is gone', () => {
    const fixture = render();
    pageLock.start();

    fixture.destroy();

    expect(pressKey().defaultPrevented).toBe(false);
  });
});
