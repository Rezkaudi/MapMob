import { adPriorityRankLabel } from './ad-priority-rank-label';

describe('adPriorityRankLabel', () => {
  it('names the top rank the way the design writes it', () => {
    expect(adPriorityRankLabel(5)).toBe('أعلى أولوية ( 5)');
  });

  it('names every other rank in the same shape', () => {
    expect(adPriorityRankLabel(3)).toBe('أولوية متوسطة ( 3)');
    expect(adPriorityRankLabel(1)).toBe('أدنى أولوية ( 1)');
  });
});
