import { GameReference } from '../models/game-reference';

type TitledGame = Pick<GameReference, 'name' | 'roundNumber'>;

export function formatRoundLabel(game: TitledGame): string {
  return `الجولة #${game.roundNumber}`;
}

/** "الأكثرية والأقلية — الجولة #104". */
export function formatGameTitle(game: TitledGame): string {
  return `${game.name} — ${formatRoundLabel(game)}`;
}
