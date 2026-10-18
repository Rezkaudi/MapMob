import { ApiField } from '../../models/api-field';
import { field } from '../shared-fields';

export const GAME_STATUS = 'enum: draft | scheduled | active | finished';
export const PRIZE_KIND = 'enum: cash | voucher';
export const DELIVERY_STATUS = 'enum: delivered | pending';

export const PRIZE_FIELDS: readonly ApiField[] = [
  field('prize.kind', PRIZE_KIND, 'cash: "جائزة مالية نقدية". voucher: "قسيمة شرائية".'),
  field(
    'prize.value',
    'object',
    '{ amount, currency }: the whole amount set aside for the winners.',
  ),
  field('prize.sponsorName', 'string | null', 'The place that gives a voucher. null for cash.'),
  field('prize.maxWinnerCount', 'integer', '"العدد الأقصى للفائزين", 1 or more.'),
];

export const GAME_FIELDS: readonly ApiField[] = [
  field('id', 'string'),
  field('name', 'string', '"اسم اللعبة", up to 100 characters.'),
  field(
    'roundNumber',
    'integer',
    'Given by the server: one more than the highest round so far. Shown as "#104".',
  ),
  field('startsAt', 'string (ISO 8601)', 'When the session starts.'),
  field(
    'timeZone',
    'string',
    'IANA name, e.g. Asia/Damascus. Every time on the screen is shown in it.',
  ),
  field('questionCount', 'integer'),
  field(
    'participantCount',
    'integer',
    'App users who voted at least once. 0 before the game starts.',
  ),
  ...PRIZE_FIELDS,
  field(
    'status',
    GAME_STATUS,
    'draft until published. After that the server works it out on every read: scheduled before startsAt, active while questions are running, finished after the last vote closes.',
  ),
];

export const WINNER_FIELDS: readonly ApiField[] = [
  field('id', 'string'),
  field('game', 'object', '{ id, name, roundNumber } of the game won.'),
  field('user', 'object', '{ id, name } of the app user.'),
  field('phone', 'string | null', 'Shown as "رقم الهاتف".'),
  field('email', 'string | null', 'Shown instead of the phone when there is none.'),
  field('prize', 'object', "{ kind, value, sponsorName }: this winner's share of the game prize."),
  field('wonOn', 'date (yyyy-mm-dd)', 'The game day, in its time zone. "تاريخ الفوز".'),
  field('deliveryStatus', DELIVERY_STATUS, '"تم التسليم" or "بانتظار التسليم".'),
];
