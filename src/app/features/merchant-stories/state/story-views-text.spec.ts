import { formatStoryViews } from './story-views-text';

describe('formatStoryViews', () => {
  it('writes the count before the noun, as the cards do', () => {
    expect(formatStoryViews(348)).toBe('348 مشاهدة');
    expect(formatStoryViews(7)).toBe('7 مشاهدات');
  });

  it('groups thousands', () => {
    expect(formatStoryViews(12500)).toBe('12,500 مشاهدة');
  });

  it('says one and two by the noun alone, and writes zero with its number', () => {
    expect(formatStoryViews(1)).toBe('مشاهدة واحدة');
    expect(formatStoryViews(2)).toBe('مشاهدتين');
    expect(formatStoryViews(0)).toBe('0 مشاهدة');
  });
});
