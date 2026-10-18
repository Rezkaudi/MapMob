import { ChangeDetectionStrategy, Component, HostListener, inject, output } from '@angular/core';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';
import { ErrorState } from '../../../../shared/ui/error-state/error-state';
import { IconTabs } from '../../../../shared/ui/icon-tabs/icon-tabs';
import { Skeleton } from '../../../../shared/ui/skeleton/skeleton';
import { GameDetailTab } from '../../models/game-detail-tab';
import { GameDetailStore } from '../../state/game-detail.store';
import { GameDetailSummary } from '../game-detail-summary/game-detail-summary';
import { GameQuestionList } from '../game-question-list/game-question-list';
import { GameStatTiles } from '../game-stat-tiles/game-stat-tiles';
import { GameWinnerList } from '../game-winner-list/game-winner-list';

/** The centred "تفاصيل اللعبة" modal. Reads the page's detail store; the page acts on its buttons. */
@Component({
  selector: 'app-game-detail-dialog',
  imports: [
    AppIcon,
    ErrorState,
    GameDetailSummary,
    GameQuestionList,
    GameStatTiles,
    GameWinnerList,
    IconTabs,
    Skeleton,
  ],
  templateUrl: './game-detail-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameDetailDialog {
  protected readonly store = inject(GameDetailStore);

  readonly closed = output<void>();
  readonly edit = output<void>();
  readonly remove = output<void>();
  readonly exportRequested = output<void>();

  protected pickTab(tab: string): void {
    this.store.selectTab(tab as GameDetailTab);
  }

  @HostListener('document:keydown.escape')
  protected closeOnEscape(): void {
    this.closed.emit();
  }
}
