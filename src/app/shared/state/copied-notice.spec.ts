import { TestBed } from '@angular/core/testing';
import { CopiedNotice } from './copied-notice';

describe('CopiedNotice', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('stays on for two seconds after each copy, then goes off', () => {
    const notice = TestBed.runInInjectionContext(() => new CopiedNotice());

    notice.show();
    vi.advanceTimersByTime(1500);
    notice.show();
    vi.advanceTimersByTime(1500);
    expect(notice.isVisible()).toBe(true);

    vi.advanceTimersByTime(500);
    expect(notice.isVisible()).toBe(false);
  });
});
