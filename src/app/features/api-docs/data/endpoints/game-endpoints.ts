import { ApiFeature } from '../../models/api-feature';
import {
  GAME_DETAIL,
  GAME_DRAFT,
  GAME_PAGE,
  GAME_ROW,
  GAME_SUMMARY,
  GAME_WINNER,
  WINNER_PAGE,
} from '../examples/game-examples';
import {
  NO_CONTENT,
  PAGED_ENVELOPE_FIELDS,
  PAGED_QUERY_FIELDS,
  csvDownload,
  exportQuery,
  field,
  optionalField,
} from '../shared-fields';
import {
  DELIVERY_STATUS,
  GAME_FIELDS,
  GAME_STATUS,
  PRIZE_FIELDS,
  WINNER_FIELDS,
} from './game-fields';

const GAME_FILTER_FIELDS = [
  ...PAGED_QUERY_FIELDS,
  optionalField('status', GAME_STATUS, 'Left out for every status ("الكل").'),
];

const WINNER_FILTER_FIELDS = [
  ...PAGED_QUERY_FIELDS,
  optionalField('gameId', 'string', 'Only the winners of this game; the detail modal sends it.'),
];

const DRAFT_FIELDS = [
  field('name', 'string', 'Required, up to 100 characters.'),
  field('description', 'string | null', '"الوصف".'),
  field(
    'startsAt',
    'string (ISO 8601)',
    'Day and time from the form, with the offset of timeZone.',
  ),
  field('timeZone', 'string', 'IANA name. Asia/Damascus is the only choice today.'),
  field('voteSeconds', 'integer', '"مهلة التصويت لكل سؤال", 1 or more.'),
  field('questions', 'object[]', 'At least one, in order.'),
  field('questions[].text', 'string', '"نص السؤال".'),
  field('questions[].options', 'string[]', 'Exactly two: the first and the second choice.'),
  ...PRIZE_FIELDS,
  field(
    'status',
    'enum: draft | scheduled',
    '"حفظ كمسودة" sends draft; "إنشاء اللعبة" sends scheduled.',
  ),
];

const GAME_NOT_FOUND = {
  status: 404,
  when: 'The game does not exist.',
  example: { message: 'Game not found.' },
};
const GAME_FINISHED = {
  status: 422,
  when: 'The game has started or finished.',
  example: { message: 'A game that has started cannot be changed or deleted.' },
};
const DRAFT_INVALID = {
  status: 422,
  when: 'A field breaks a rule, or a scheduled game starts in the past.',
  example: {
    message: 'The start must be later than now.',
    errors: { startsAt: ['The start must be later than now.'] },
  },
};

export const GAMES_FEATURE: ApiFeature = {
  id: 'games',
  name: 'Games',
  app: 'admin',
  screen: '/admin/games',
  permissionModule: 'offers',
  intro:
    'The majority and minority game ("لعبة الأكثرية و الأقلية"): admins plan rounds of two-choice questions with a prize, app users vote, and the players who pick the majority answer win. The screen lists the rounds and every winner, and tracks which prizes were handed over. The roles screen has no games row yet, so these calls use the offers permissions.',
  endpoints: [
    {
      id: 'games-list',
      method: 'GET',
      path: '/games',
      summary: 'The paged "جلسات الألعاب" table, three rows a page.',
      queryParams: GAME_FILTER_FIELDS,
      response: {
        status: 200,
        description: 'One page, latest startsAt first.',
        example: GAME_PAGE,
        fields: [
          ...PAGED_ENVELOPE_FIELDS,
          ...GAME_FIELDS.map((one) => ({ ...one, name: `items[].${one.name}` })),
        ],
      },
      notes: ['search matches the round number, with or without "#", or the game name.'],
    },
    {
      id: 'games-summary',
      method: 'GET',
      path: '/games/summary',
      summary: 'The four cards, the status chip counts, and the "اللعبة القادمة" banner.',
      response: {
        status: 200,
        description: 'Counted over every game, whatever the table filters.',
        example: GAME_SUMMARY,
        fields: [
          field('gameCount', 'integer', 'Every game. The "الكل" chip and "إجمالي الألعاب".'),
          field('scheduledCount', 'integer', 'Games with status scheduled.'),
          field('finishedCount', 'integer', 'Games with status finished.'),
          field('participantCount', 'integer', 'participantCount of every game added up.'),
          field('winnerCount', 'integer', 'Every winner row.'),
          field('deliveredPrizeCount', 'integer', 'Winner rows with deliveryStatus delivered.'),
          field(
            'upcomingGame',
            'object | null',
            'The scheduled game with the nearest startsAt still to come, as a table row. null when none is planned.',
          ),
        ],
      },
    },
    {
      id: 'games-detail',
      method: 'GET',
      path: '/games/{id}',
      summary: 'One game for the "تفاصيل اللعبة" modal and the edit page.',
      response: {
        status: 200,
        description: 'The table row plus its questions and winner counts.',
        example: GAME_DETAIL,
        fields: [
          ...GAME_FIELDS,
          field('description', 'string | null'),
          field('voteSeconds', 'integer'),
          field('questions[].id', 'string'),
          field('questions[].text', 'string'),
          field('questions[].options[]', 'object', '{ id, text, voteCount }. Always two.'),
          field(
            'questions[].options[].voteCount',
            'integer | null',
            'null until the game has finished.',
          ),
          field('winnerCount', 'integer'),
          field('deliveredPrizeCount', 'integer'),
        ],
      },
      errors: [GAME_NOT_FOUND],
    },
    {
      id: 'games-create',
      method: 'POST',
      path: '/games',
      summary: 'Create a game from "إنشاء لعبة جديدة".',
      body: { contentType: 'application/json', fields: DRAFT_FIELDS, example: GAME_DRAFT },
      response: { status: 201, description: 'The new game, as a table row.', example: GAME_ROW },
      errors: [DRAFT_INVALID],
      notes: [
        'Give the game the next roundNumber.',
        'sponsorName is required when prize.kind is voucher and must be null for cash.',
        'A draft may keep any day; a scheduled game must start later than now.',
      ],
    },
    {
      id: 'games-update',
      method: 'PUT',
      path: '/games/{id}',
      summary: 'Save the edit page; also "تعديل الموعد" on the banner.',
      body: { contentType: 'application/json', fields: DRAFT_FIELDS, example: GAME_DRAFT },
      response: {
        status: 200,
        description: 'The updated game, as a table row.',
        example: GAME_ROW,
      },
      errors: [GAME_NOT_FOUND, GAME_FINISHED, DRAFT_INVALID],
      notes: ['Keep the roundNumber. Replace the questions with the ones sent.'],
    },
    {
      id: 'games-delete',
      method: 'DELETE',
      path: '/games/{id}',
      summary: 'Delete a draft or scheduled game, after the admin confirms.',
      response: NO_CONTENT,
      errors: [GAME_NOT_FOUND, GAME_FINISHED],
      notes: ['Also delete its questions and options.'],
    },
    {
      id: 'games-winners',
      method: 'GET',
      path: '/games/winners',
      summary: 'The paged "الفائزون" table, four rows a page, and the winners tab of the modal.',
      queryParams: WINNER_FILTER_FIELDS,
      response: {
        status: 200,
        description: 'One page, latest wonOn first.',
        example: WINNER_PAGE,
        fields: [
          ...PAGED_ENVELOPE_FIELDS,
          ...WINNER_FIELDS.map((one) => ({ ...one, name: `items[].${one.name}` })),
        ],
      },
      notes: [
        'search matches the winner name or phone.',
        'The modal sends gameId with pageSize 100 to get every winner of one game.',
      ],
    },
    {
      id: 'games-winner-delivery',
      method: 'PATCH',
      path: '/games/winners/{id}/delivery',
      summary: '"تغيير الحالة": mark a prize delivered, or back to waiting.',
      body: {
        contentType: 'application/json',
        fields: [field('deliveryStatus', DELIVERY_STATUS)],
        example: { deliveryStatus: 'delivered' },
      },
      response: {
        status: 200,
        description: 'The updated winner row.',
        example: { ...GAME_WINNER, deliveryStatus: 'delivered' },
      },
      errors: [
        {
          status: 404,
          when: 'The winner does not exist.',
          example: { message: 'Winner not found.' },
        },
      ],
      notes: ['Store when and by which admin a prize was delivered.'],
    },
    {
      id: 'games-winners-export',
      method: 'GET',
      path: '/games/winners/export',
      summary: '"تصدير الكشف" and "تصدير قائمة الفائزين" as CSV.',
      queryParams: exportQuery(WINNER_FILTER_FIELDS),
      response: csvDownload('winner'),
      notes: [
        'Columns: winner, phone, email, game and round, prize, wonOn, delivery status.',
        'Send Content-Disposition: attachment. UTF-8 with a BOM so Excel shows Arabic.',
      ],
    },
  ],
};
