import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CLOCK } from '../../../../core/config/clock';
import { FileSaver } from '../../../../shared/files/file-saver';
import { toCalendarDay } from '../../../../shared/formatting/calendar-day';
import { ConfirmActionDialog } from '../../../../shared/ui/confirm-action-dialog/confirm-action-dialog';
import { ErrorState } from '../../../../shared/ui/error-state/error-state';
import { IconTabs } from '../../../../shared/ui/icon-tabs/icon-tabs';
import { PageHeader } from '../../../../shared/ui/page-header/page-header';
import { StatCard } from '../../../../shared/ui/stat-card/stat-card';
import { TablePagination } from '../../../../shared/ui/table-pagination/table-pagination';
import { Toast } from '../../../../shared/ui/toast/toast';
import { GameEntry } from '../../models/game-entry';
import { GameTab } from '../../models/game-tab';
import { GameWinner } from '../../models/game-winner';
import { GameDetailStore } from '../../state/game-detail.store';
import { GAME_PAGE_TABS } from '../../state/game-tabs';
import { GamesStore } from '../../state/games.store';
import { WinnersStore } from '../../state/winners.store';
import { GameDetailDialog } from '../../ui/game-detail-dialog/game-detail-dialog';
import { GameTable } from '../../ui/game-table/game-table';
import { GameToolbar } from '../../ui/game-toolbar/game-toolbar';
import { UpcomingGameBanner } from '../../ui/upcoming-game-banner/upcoming-game-banner';
import { WinnerTable } from '../../ui/winner-table/winner-table';
import { WinnerToolbar } from '../../ui/winner-toolbar/winner-toolbar';

const GAMES_URL = '/admin/games';

@Component({
  selector: 'app-game-hub',
  imports: [
    ConfirmActionDialog,
    ErrorState,
    GameDetailDialog,
    GameTable,
    GameToolbar,
    IconTabs,
    PageHeader,
    StatCard,
    TablePagination,
    Toast,
    UpcomingGameBanner,
    WinnerTable,
    WinnerToolbar,
  ],
  providers: [GamesStore, WinnersStore, GameDetailStore],
  templateUrl: './game-hub.html',
  host: { class: 'flex min-h-full flex-col' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameHub {
  private readonly router = inject(Router);
  private readonly fileSaver = inject(FileSaver);
  private readonly clock = inject(CLOCK);
  protected readonly games = inject(GamesStore);
  protected readonly winners = inject(WinnersStore);
  protected readonly detail = inject(GameDetailStore);

  protected readonly tabs = GAME_PAGE_TABS;
  protected readonly tab = signal<GameTab>('sessions');
  private hasLoadedWinners = false;

  constructor() {
    this.games.reloadAll();
  }

  protected pickTab(tab: string): void {
    this.tab.set(tab as GameTab);
    if (tab === 'winners' && !this.hasLoadedWinners) {
      this.hasLoadedWinners = true;
      this.winners.loadWinners();
    }
  }

  protected addGame(): void {
    this.router.navigateByUrl(`${GAMES_URL}/new`);
  }

  protected editGame(gameId: string): void {
    this.router.navigateByUrl(`${GAMES_URL}/${gameId}/edit`);
  }

  protected openWinnerGame(winner: GameWinner): void {
    this.detail.open(winner.game.id, 'winners');
  }

  protected editOpenGame(): void {
    const gameId = this.detail.gameId();
    if (gameId) {
      this.editGame(gameId);
    }
  }

  /** The modal steps aside so the delete question is the only thing on screen. */
  protected deleteOpenGame(): void {
    const game: GameEntry | null = this.detail.detail();
    this.detail.close();
    if (game) {
      this.games.askToDelete(game);
    }
  }

  protected confirmDeliveryChange(): void {
    this.winners.confirmDeliveryChange(() => this.games.loadSummary());
  }

  protected async exportAllWinners(): Promise<void> {
    const file = await this.winners.exportWinners();
    if (file) {
      this.fileSaver.save(file, `game-winners-${toCalendarDay(this.clock())}.csv`);
    }
  }

  protected async exportOpenGameWinners(): Promise<void> {
    const round = this.detail.detail()?.roundNumber;
    const file = await this.detail.exportWinners();
    if (file) {
      this.fileSaver.save(file, `game-${round}-winners-${toCalendarDay(this.clock())}.csv`);
    }
  }
}
