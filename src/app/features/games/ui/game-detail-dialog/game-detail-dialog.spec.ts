import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { GameRepository } from '../../data/game.repository';
import { GameDetail } from '../../models/game-detail';
import { GameDetailStore } from '../../state/game-detail.store';
import { buildGameDetail, buildWinner } from '../../testing/game-fixture';
import { GameDetailDialog } from './game-detail-dialog';

function render(detail: GameDetail) {
  TestBed.configureTestingModule({
    providers: [
      GameDetailStore,
      {
        provide: GameRepository,
        useValue: {
          getGameDetail: () => of(detail),
          getWinners: () => of({ items: [buildWinner()], totalCount: 1 }),
          exportWinners: () => of(new Blob(['csv'])),
        },
      },
    ],
  });
  const store = TestBed.inject(GameDetailStore);
  store.open(detail.id);
  const fixture = TestBed.createComponent(GameDetailDialog);
  fixture.detectChanges();
  const element: HTMLElement = fixture.nativeElement;
  const footerButtons = () =>
    Array.from(element.querySelectorAll('footer button')).map((button) =>
      button.textContent?.trim(),
    );
  return { fixture, element, store, footerButtons };
}

describe('GameDetailDialog', () => {
  it('shows a scheduled game with its questions, edit and delete', () => {
    const { element, footerButtons } = render(buildGameDetail());
    expect(element.querySelector('h2')?.textContent?.trim()).toBe('تفاصيل اللعبة');
    expect(element.querySelector('app-game-stat-tiles')).toBeNull();
    expect(element.querySelector('app-game-question-list')).not.toBeNull();
    expect(footerButtons()).toEqual(['حذف اللعبة', 'تعديل اللعبة']);
  });

  it('shows a finished game with its numbers and winners, and offers their file', () => {
    const { element, footerButtons } = render(
      buildGameDetail({ status: 'finished', winnerCount: 1 }),
    );
    expect(element.querySelector('app-game-stat-tiles')).not.toBeNull();
    expect(element.querySelector('app-game-winner-list')).not.toBeNull();
    expect(footerButtons()).toEqual(['إلغاء', 'تصدير قائمة الفائزين']);
  });

  it('drops the export on the questions tab of a finished game', () => {
    const { fixture, element, store, footerButtons } = render(
      buildGameDetail({ status: 'finished' }),
    );
    store.selectTab('questions');
    fixture.detectChanges();
    expect(element.querySelector('app-game-question-list')).not.toBeNull();
    expect(footerButtons()).toEqual(['إلغاء']);
  });

  it('asks the page to edit, delete or close', () => {
    const { fixture, element } = render(buildGameDetail());
    const events: string[] = [];
    fixture.componentInstance.edit.subscribe(() => events.push('edit'));
    fixture.componentInstance.remove.subscribe(() => events.push('remove'));
    fixture.componentInstance.closed.subscribe(() => events.push('closed'));
    element
      .querySelectorAll<HTMLButtonElement>('footer button')
      .forEach((button) => button.click());
    element.querySelector<HTMLButtonElement>('[aria-label="إغلاق النافذة"]')?.click();
    expect(events).toEqual(['remove', 'edit', 'closed']);
  });
});
