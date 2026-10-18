import { CsvRow, buildCsvFile } from '../../../shared/files/csv-file';
import { GameWinner } from '../models/game-winner';
import { PRIZE_DELIVERY_LABELS } from '../models/prize-delivery-status';
import { formatGameTitle } from '../state/game-title';
import { describeWonPrize } from '../state/prize-text';

const HEADER: CsvRow = [
  'الفائز',
  'رقم الهاتف',
  'البريد الإلكتروني',
  'اللعبة',
  'الجائزة',
  'تاريخ الفوز',
  'حالة الجائزة',
];

function toRow(winner: GameWinner): CsvRow {
  return [
    winner.user.name,
    winner.phone ?? '',
    winner.email ?? '',
    formatGameTitle(winner.game),
    describeWonPrize(winner.prize),
    winner.wonOn,
    PRIZE_DELIVERY_LABELS[winner.deliveryStatus],
  ];
}

export function buildWinnersCsvRows(winners: readonly GameWinner[]): readonly CsvRow[] {
  return [HEADER, ...winners.map(toRow)];
}

export function buildWinnersCsvFile(winners: readonly GameWinner[]): Blob {
  return buildCsvFile(buildWinnersCsvRows(winners));
}
