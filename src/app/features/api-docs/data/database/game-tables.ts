import { DbDomain } from '../../models/db-domain';
import { ID, TIMESTAMPS, adminReference, foreignKey } from './db-columns';

export const GAME_DOMAIN: DbDomain = {
  id: 'db-games',
  name: 'Games and prizes',
  description:
    'Majority and minority rounds, their questions, the votes app users cast, and the winners.',
  layout: [
    ['games', 'game_questions', 'game_options'],
    ['game_votes', 'game_winners'],
  ],
  tables: [
    {
      name: 'games',
      description: 'One row per round.',
      servedAs: '/games',
      columns: [
        ID,
        { name: 'name', type: 'varchar(100)' },
        { name: 'round_number', type: 'int unsigned', key: 'uq', note: 'Served as roundNumber.' },
        { name: 'description', type: 'varchar(500)', isNullable: true },
        { name: 'starts_at', type: 'timestamp' },
        { name: 'time_zone', type: 'varchar(64)', note: "Default 'Asia/Damascus'." },
        { name: 'vote_seconds', type: 'smallint unsigned' },
        { name: 'prize_kind', type: "enum('cash','voucher')" },
        { name: 'prize_amount', type: 'decimal(12,2)' },
        { name: 'prize_currency', type: 'char(3)', note: 'SYP or USD.' },
        {
          name: 'prize_sponsor_name',
          type: 'varchar(120)',
          isNullable: true,
          note: 'Voucher only.',
        },
        { name: 'max_winner_count', type: 'smallint unsigned' },
        {
          name: 'is_draft',
          type: 'boolean',
          note: 'The rest of status is worked out from starts_at on every read.',
        },
        adminReference('created_by', 'The admin who made the game.'),
        ...TIMESTAMPS,
      ],
      indexes: ['INDEX (starts_at)'],
    },
    {
      name: 'game_questions',
      description: 'The questions of a round, in order.',
      servedAs: 'questions on /games/{id}',
      columns: [
        ID,
        foreignKey('game_id', 'games.id', 'Cascade on delete.'),
        { name: 'position', type: 'smallint unsigned' },
        { name: 'text', type: 'varchar(300)' },
      ],
      indexes: ['UNIQUE (game_id, position)'],
    },
    {
      name: 'game_options',
      description: 'The two choices of a question.',
      servedAs: 'questions[].options on /games/{id}',
      columns: [
        ID,
        foreignKey('question_id', 'game_questions.id', 'Cascade on delete.'),
        { name: 'position', type: 'tinyint unsigned', note: '1 or 2.' },
        { name: 'text', type: 'varchar(120)' },
      ],
      indexes: ['UNIQUE (question_id, position)'],
    },
    {
      name: 'game_votes',
      description:
        'One vote of one app user on one question. Counted into voteCount and participantCount.',
      servedAs: 'voteCount and participantCount',
      columns: [
        ID,
        foreignKey('option_id', 'game_options.id'),
        foreignKey('question_id', 'game_questions.id'),
        foreignKey('user_id', 'users.id'),
        { name: 'created_at', type: 'timestamp' },
      ],
      indexes: ['UNIQUE (question_id, user_id)'],
    },
    {
      name: 'game_winners',
      description: 'Players who won a round and how far their prize got.',
      servedAs: '/games/winners',
      columns: [
        ID,
        foreignKey('game_id', 'games.id'),
        foreignKey('user_id', 'users.id'),
        { name: 'prize_amount', type: 'decimal(12,2)', note: "This winner's share." },
        { name: 'won_on', type: 'date' },
        {
          name: 'delivery_status',
          type: "enum('delivered','pending')",
          note: "Default 'pending'.",
        },
        { name: 'delivered_at', type: 'timestamp', isNullable: true },
        adminReference('delivered_by', 'The admin who marked it delivered.'),
        ...TIMESTAMPS,
      ],
      indexes: ['UNIQUE (game_id, user_id)', 'INDEX (delivery_status)'],
    },
  ],
};
