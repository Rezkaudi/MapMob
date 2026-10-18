import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { CLOCK } from '../../../../core/config/clock';
import { GameRepository } from '../../data/game.repository';
import { buildGame, buildGameDetail, buildSummary, buildWinner } from '../../testing/game-fixture';
import { GameHub } from './game-hub';

const NOW = new Date('2026-10-11T09:00:00.000Z');

function render() {
  const repository: Partial<GameRepository> = {
    getGames: vi.fn(() => of({ items: [buildGame()], totalCount: 1 })),
    getSummary: vi.fn(() => of(buildSummary())),
    getWinners: vi.fn(() => of({ items: [buildWinner()], totalCount: 1 })),
    getGameDetail: vi.fn(() => of(buildGameDetail())),
    deleteGame: vi.fn(() => of(undefined)),
  };
  TestBed.configureTestingModule({
    providers: [
      provideRouter([]),
      { provide: GameRepository, useValue: repository },
      { provide: CLOCK, useValue: () => NOW },
    ],
  });
  const fixture = TestBed.createComponent(GameHub);
  fixture.detectChanges();
  const element: HTMLElement = fixture.nativeElement;
  const router = TestBed.inject(Router);
  vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
  const tabs = () => element.querySelectorAll<HTMLButtonElement>('app-icon-tabs [role="tab"]');
  return { fixture, element, repository, router, tabs };
}

describe('GameHub', () => {
  it('heads the page and fills the cards, the banner and the sessions table', () => {
    const { element } = render();
    expect(element.querySelector('h1')?.textContent?.trim()).toBe('لعبة الأكثرية و الأقلية');
    expect(element.querySelectorAll('app-stat-card')).toHaveLength(4);
    expect(element.querySelector('app-upcoming-game-banner')).not.toBeNull();
    expect(element.querySelector('app-game-table')).not.toBeNull();
    expect(element.querySelector('app-winner-table')).toBeNull();
  });

  it('loads the winners when their tab opens', () => {
    const { fixture, element, repository, tabs } = render();
    expect(repository.getWinners).not.toHaveBeenCalled();

    tabs()[1].click();
    fixture.detectChanges();

    expect(repository.getWinners).toHaveBeenCalled();
    expect(element.querySelector('app-winner-table')).not.toBeNull();
    expect(element.querySelector('app-game-table')).toBeNull();
  });

  it('goes to the add page', () => {
    const { element, router } = render();
    element.querySelector<HTMLButtonElement>('app-add-button button')?.click();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/admin/games/new');
  });

  it('opens the upcoming game in the detail modal, and its schedule in the edit page', () => {
    const { fixture, element, router } = render();
    const bannerButtons = element.querySelectorAll<HTMLButtonElement>(
      'app-upcoming-game-banner button',
    );

    bannerButtons[1].click();
    fixture.detectChanges();
    expect(element.querySelector('app-game-detail-dialog')).not.toBeNull();

    bannerButtons[0].click();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/admin/games/game-104/edit');
  });

  it('asks before deleting from the detail modal', () => {
    const { fixture, element } = render();
    element.querySelectorAll<HTMLButtonElement>('app-upcoming-game-banner button')[1].click();
    fixture.detectChanges();

    element.querySelector<HTMLButtonElement>('app-game-detail-dialog footer button')?.click();
    fixture.detectChanges();

    expect(element.querySelector('app-game-detail-dialog')).toBeNull();
    expect(element.querySelector('app-confirm-action-dialog')?.textContent).toContain('حذف اللعبة');
  });
});
