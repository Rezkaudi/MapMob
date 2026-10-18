import { ConfirmActionCopy } from '../../../shared/ui/confirm-action-dialog/confirm-action-copy';
import { GameEntry } from '../models/game-entry';
import { GameWinner } from '../models/game-winner';
import { PRIZE_DELIVERY_LABELS } from '../models/prize-delivery-status';
import { formatGameClock, formatGameDay } from './game-schedule-text';
import { formatGameTitle } from './game-title';
import { describeWonPrize } from './prize-text';

const HALO_GLYPH_SIZE = 24;

export function buildDeleteGameCopy(game: GameEntry): ConfirmActionCopy {
  const day = formatGameDay(game.startsAt, game.timeZone);
  const clock = formatGameClock(game.startsAt, game.timeZone);
  return {
    title: 'حذف اللعبة',
    question: 'هل أنت متأكد من حذف هذه اللعبة؟ ستُحذف أسئلتها وإعدادات جائزتها.',
    detail: 'تنبيه: إجراء نهائي لا يمكن التراجع عنه',
    detailAppearance: 'callout',
    confirmLabel: 'حذف اللعبة',
    tone: 'critical',
    context: { lines: [formatGameTitle(game), `${day} — ${clock}`], imageUrl: null },
  };
}

/** Confirms the flip a winner row offers: a waiting prize becomes delivered, and back. */
export function buildDeliveryChangeCopy(winner: GameWinner): ConfirmActionCopy {
  const context = {
    lines: [winner.user.name, describeWonPrize(winner.prize)],
    imageUrl: null,
    tag: `الحالة: ${PRIZE_DELIVERY_LABELS[winner.deliveryStatus]}`,
  };
  if (winner.deliveryStatus === 'pending') {
    return {
      title: 'تأكيد تسليم الجائزة',
      question: `هل تم تسليم الجائزة إلى ${winner.user.name}؟`,
      confirmLabel: PRIZE_DELIVERY_LABELS.delivered,
      tone: 'success',
      context,
    };
  }
  return {
    title: 'إلغاء تسليم الجائزة',
    question: `ستعود جائزة ${winner.user.name} إلى قائمة الجوائز بانتظار التسليم.`,
    confirmLabel: PRIZE_DELIVERY_LABELS.pending,
    tone: 'warning',
    icon: { name: 'change-status', size: HALO_GLYPH_SIZE },
    context,
  };
}
