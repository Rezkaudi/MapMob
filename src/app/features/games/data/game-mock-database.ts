import { Clock } from '../../../core/config/clock';
import { paginate } from '../../../shared/lists/paginate';
import { GameDetail } from '../models/game-detail';
import { GameDraft } from '../models/game-draft';
import { GameEntry } from '../models/game-entry';
import { GamePage } from '../models/game-page';
import { GameQuery } from '../models/game-query';
import { GameSummary } from '../models/game-summary';
import { GameWinner } from '../models/game-winner';
import { PrizeDeliveryStatus } from '../models/prize-delivery-status';
import { WinnerPage } from '../models/winner-page';
import { WinnerQuery } from '../models/winner-query';
import { canChangeGame } from '../state/game-status-pill';
import { matchGames, matchWinners } from './game-list-query';
import { toGameEntry, toGameRecord } from './game-mock-records';
import { buildWinnersCsvFile } from './winners-csv';

const NOT_FOUND_MESSAGE = 'لم تعد هذه اللعبة موجودة.';
const WINNER_NOT_FOUND_MESSAGE = 'لم يعد هذا الفائز موجوداً.';
const FINISHED_MESSAGE = 'انتهت هذه اللعبة ولا يمكن تعديلها أو حذفها.';

export interface GameMockSeed {
  readonly games: readonly GameDetail[];
  readonly winners: readonly GameWinner[];
}

/** The in-memory games and winners behind the mock repository, loaded on first use. */
export class GameMockDatabase {
  private games: readonly GameDetail[];
  private winnerList: readonly GameWinner[];
  private nextIdNumber = 1;

  constructor(
    seed: GameMockSeed,
    private readonly now: Clock,
  ) {
    this.games = seed.games;
    this.winnerList = seed.winners;
  }

  page(query: GameQuery): GamePage {
    const rows = matchGames(this.games, query).map(toGameEntry);
    return paginate(rows, query.pageIndex, query.pageSize);
  }

  summary(): GameSummary {
    const countOf = (status: GameEntry['status']) =>
      this.games.filter((game) => game.status === status).length;
    const upcoming = matchGames(this.games, { status: 'scheduled', sort: 'oldest' }).find(
      (game) => new Date(game.startsAt).getTime() > this.now().getTime(),
    );
    return {
      gameCount: this.games.length,
      scheduledCount: countOf('scheduled'),
      finishedCount: countOf('finished'),
      participantCount: this.games.reduce((total, game) => total + game.participantCount, 0),
      winnerCount: this.winnerList.length,
      deliveredPrizeCount: this.deliveredCount(this.winnerList),
      upcomingGame: upcoming ? toGameEntry(upcoming) : null,
    };
  }

  detail(id: string): GameDetail {
    const game = this.findOrThrow(id);
    const winners = this.winnerList.filter((winner) => winner.game.id === id);
    return {
      ...game,
      winnerCount: winners.length,
      deliveredPrizeCount: this.deliveredCount(winners),
    };
  }

  create(draft: GameDraft): GameEntry {
    const lastRound = Math.max(0, ...this.games.map((game) => game.roundNumber));
    const keys = {
      id: `game-new-${this.nextIdNumber++}`,
      roundNumber: lastRound + 1,
      participantCount: 0,
    };
    const created = toGameRecord(draft, keys);
    this.games = [...this.games, created];
    return toGameEntry(created);
  }

  update(id: string, draft: GameDraft): GameEntry {
    const saved = this.findChangeableOrThrow(id);
    const updated = toGameRecord(draft, saved);
    this.games = this.games.map((game) => (game.id === id ? updated : game));
    return toGameEntry(updated);
  }

  remove(id: string): void {
    this.findChangeableOrThrow(id);
    this.games = this.games.filter((game) => game.id !== id);
  }

  winners(query: WinnerQuery): WinnerPage {
    return paginate(matchWinners(this.winnerList, query), query.pageIndex, query.pageSize);
  }

  setDelivery(winnerId: string, deliveryStatus: PrizeDeliveryStatus): void {
    if (!this.winnerList.some((winner) => winner.id === winnerId)) {
      throw new Error(WINNER_NOT_FOUND_MESSAGE);
    }
    this.winnerList = this.winnerList.map((winner) =>
      winner.id === winnerId ? { ...winner, deliveryStatus } : winner,
    );
  }

  exportedWinnersFile(query: WinnerQuery): Blob {
    return buildWinnersCsvFile(matchWinners(this.winnerList, query));
  }

  private deliveredCount(winners: readonly GameWinner[]): number {
    return winners.filter((winner) => winner.deliveryStatus === 'delivered').length;
  }

  private findChangeableOrThrow(id: string): GameDetail {
    const found = this.findOrThrow(id);
    if (!canChangeGame(found.status)) {
      throw new Error(FINISHED_MESSAGE);
    }
    return found;
  }

  private findOrThrow(id: string): GameDetail {
    const found = this.games.find((game) => game.id === id);
    if (!found) {
      throw new Error(NOT_FOUND_MESSAGE);
    }
    return found;
  }
}
