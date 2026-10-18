import { IconTab } from '../../../shared/ui/icon-tabs/icon-tab';
import { GameDetailTab } from '../models/game-detail-tab';
import { GameTab } from '../models/game-tab';

/** RTL puts the first tab on the right. */
export const GAME_PAGE_TABS: readonly IconTab<GameTab>[] = [
  { value: 'sessions', label: 'جلسات الألعاب', icon: 'games', iconSize: 20 },
  { value: 'winners', label: 'الفائزون', icon: 'users-group', iconSize: 16 },
];

const QUESTIONS_TAB: IconTab<GameDetailTab> = {
  value: 'questions',
  label: 'أسئلة و أجوبة اللعبة',
  icon: 'games',
  iconSize: 20,
};
const WINNERS_TAB: IconTab<GameDetailTab> = {
  value: 'winners',
  label: 'الفائزون في هذه اللعبة',
  icon: 'users-group',
  iconSize: 16,
};

/** Only a finished game has winners to list. */
export function gameDetailTabsFor(isFinished: boolean): readonly IconTab<GameDetailTab>[] {
  return isFinished ? [QUESTIONS_TAB, WINNERS_TAB] : [QUESTIONS_TAB];
}
