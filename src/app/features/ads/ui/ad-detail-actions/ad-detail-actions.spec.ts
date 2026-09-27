import { TestBed } from '@angular/core/testing';
import { AdPauseAction } from '../../models/ad-pause-action';
import { AdDetailActions } from './ad-detail-actions';

function render(pauseAction: AdPauseAction | null, isBusy = false) {
  const fixture = TestBed.createComponent(AdDetailActions);
  fixture.componentRef.setInput('pauseAction', pauseAction);
  fixture.componentRef.setInput('isBusy', isBusy);
  fixture.detectChanges();
  return fixture;
}

function labels(element: HTMLElement): string[] {
  return Array.from(element.querySelectorAll('button')).map(
    (button) => button.textContent?.trim() ?? '',
  );
}

describe('AdDetailActions', () => {
  it('draws edit, pause and delete, in that order from the right', () => {
    const element = render('pause').nativeElement as HTMLElement;

    expect(labels(element)).toEqual(['تعديل الإعلان', 'إيقاف الإعلان', 'حذف']);
  });

  it('offers to put a stopped ad back on air instead', () => {
    const element = render('resume').nativeElement as HTMLElement;

    expect(labels(element)).toEqual(['تعديل الإعلان', 'تفعيل الإعلان', 'حذف']);
  });

  it('drops the toggle for an ad whose days are over', () => {
    const element = render(null).nativeElement as HTMLElement;

    expect(labels(element)).toEqual(['تعديل الإعلان', 'حذف']);
  });

  it('reports each action it was clicked with', () => {
    const fixture = render('pause');
    const edited = vi.fn();
    const statusChanged = vi.fn();
    const removed = vi.fn();
    fixture.componentInstance.edit.subscribe(edited);
    fixture.componentInstance.statusChange.subscribe(statusChanged);
    fixture.componentInstance.remove.subscribe(removed);

    (fixture.nativeElement as HTMLElement)
      .querySelectorAll('button')
      .forEach((button) => button.click());

    expect([edited, statusChanged, removed].map((spy) => spy.mock.calls.length)).toEqual([1, 1, 1]);
  });

  it('locks every button while a save runs', () => {
    const element = render('pause', true).nativeElement as HTMLElement;

    expect(Array.from(element.querySelectorAll('button')).every((button) => button.disabled)).toBe(
      true,
    );
  });
});
