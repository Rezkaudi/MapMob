import { TestBed } from '@angular/core/testing';
import { UpcomingGameView } from '../../models/upcoming-game-view';
import { UpcomingGameBanner } from './upcoming-game-banner';

const VIEW: UpcomingGameView = {
  gameId: 'game-104',
  statusText: 'اللعبة القادمة • مجدولة',
  title: 'الأكثرية والأقلية — الجولة #104',
  scheduleText: '15 أكتوبر 2026 — 18:00 (بعد 4 أيام)',
  prizeText: '50,000 ل.س جائزة نقدية',
};

function render() {
  const fixture = TestBed.createComponent(UpcomingGameBanner);
  fixture.componentRef.setInput('view', VIEW);
  fixture.detectChanges();
  const element: HTMLElement = fixture.nativeElement;
  return { fixture, element };
}

describe('UpcomingGameBanner', () => {
  it('writes the status, title, start and prize', () => {
    const { element } = render();
    const text = (role: string) =>
      element.querySelector(`[data-role="${role}"]`)?.textContent?.trim();
    expect(text('status')).toBe(VIEW.statusText);
    expect(text('title')).toBe(VIEW.title);
    expect(text('schedule')).toBe(VIEW.scheduleText);
    expect(text('prize')).toBe(VIEW.prizeText);
  });

  it('opens the game and its schedule', () => {
    const { fixture, element } = render();
    const opened = vi.fn();
    const rescheduled = vi.fn();
    fixture.componentInstance.viewDetails.subscribe(opened);
    fixture.componentInstance.reschedule.subscribe(rescheduled);
    const buttons = Array.from(element.querySelectorAll('button'));

    buttons.find((button) => button.textContent?.includes('عرض تفاصيل اللعبة'))?.click();
    buttons.find((button) => button.textContent?.includes('تعديل الموعد'))?.click();

    expect(opened).toHaveBeenCalled();
    expect(rescheduled).toHaveBeenCalled();
  });
});
