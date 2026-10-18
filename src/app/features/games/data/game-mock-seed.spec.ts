import { buildGameMockSeed } from './game-mock-seed';

const NOW = new Date('2026-10-11T09:00:00.000Z');

describe('buildGameMockSeed', () => {
  const seed = buildGameMockSeed(NOW);

  it('has finished games in the past and scheduled ones still to come', () => {
    const finished = seed.games.filter((game) => game.status === 'finished');
    const scheduled = seed.games.filter((game) => game.status === 'scheduled');
    expect(finished.length).toBeGreaterThan(10);
    expect(scheduled.length).toBeGreaterThan(1);
    expect(finished.every((game) => new Date(game.startsAt) < NOW)).toBe(true);
    expect(scheduled.every((game) => new Date(game.startsAt) > NOW)).toBe(true);
    expect(seed.games.some((game) => game.status === 'draft')).toBe(true);
  });

  it('gives each round its own number', () => {
    const rounds = seed.games.map((game) => game.roundNumber);
    expect(new Set(rounds).size).toBe(rounds.length);
  });

  it('counts votes only on finished games', () => {
    for (const game of seed.games) {
      const counts = game.questions.flatMap((question) => question.options.map((o) => o.voteCount));
      expect(
        counts.every((count) => (game.status === 'finished' ? count !== null : count === null)),
      ).toBe(true);
      expect(game.questionCount).toBe(game.questions.length);
    }
  });

  it('gives every finished game its winners, some still waiting for their prize', () => {
    const finishedIds = seed.games
      .filter((game) => game.status === 'finished')
      .map((game) => game.id);
    expect(new Set(seed.winners.map((winner) => winner.game.id))).toEqual(new Set(finishedIds));
    expect(seed.winners.some((winner) => winner.deliveryStatus === 'pending')).toBe(true);
  });
});
