import { GameWinner } from '../models/game-winner';
import { PRIZE_DELIVERY_LABELS, PrizeDeliveryStatus } from '../models/prize-delivery-status';
import { WinnerRow } from '../models/winner-row';
import { WonPrize } from '../models/won-prize';
import { describeWonPrize, formatPrizeValue } from './prize-text';

const MISSING_CONTACT = '—';

export const PRIZE_DELIVERY_PILL_CLASSES: Record<PrizeDeliveryStatus, string> = {
  delivered: 'bg-status-success',
  pending: 'bg-accent',
};

/** "16/1/2023": the frame drops the leading zeros. */
function formatWinDay(day: string): string {
  const [year, month, date] = day.split('-');
  return `${Number(date)}/${Number(month)}/${year}`;
}

function describeTablePrize(prize: WonPrize): string {
  return prize.kind === 'cash' ? formatPrizeValue(prize.value) : describeWonPrize(prize);
}

export function toWinnerRow(winner: GameWinner): WinnerRow {
  return {
    winner,
    contactText: winner.phone ?? winner.email ?? MISSING_CONTACT,
    roundText: `#${winner.game.roundNumber}`,
    prizeText: describeTablePrize(winner.prize),
    prizeSentence: describeWonPrize(winner.prize),
    wonOnText: formatWinDay(winner.wonOn),
    statusLabel: PRIZE_DELIVERY_LABELS[winner.deliveryStatus],
    pillClass: PRIZE_DELIVERY_PILL_CLASSES[winner.deliveryStatus],
  };
}
