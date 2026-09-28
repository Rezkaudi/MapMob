import { activeSectionAt } from './active-section';

const tops = [
  { id: 'overview', top: -900 },
  { id: 'conventions', top: -40 },
  { id: 'issues', top: 300 },
];

describe('activeSectionAt', () => {
  it('picks the last section whose top has passed the reading line', () => {
    expect(activeSectionAt(tops, 120)).toBe('conventions');
  });

  it('picks the first section before any has passed', () => {
    expect(activeSectionAt([{ id: 'overview', top: 400 }], 120)).toBe('overview');
  });

  it('picks the last section once the page is scrolled to its end', () => {
    expect(activeSectionAt(tops, 120, true)).toBe('issues');
  });

  it('gives nothing when there are no sections', () => {
    expect(activeSectionAt([], 120)).toBeNull();
  });
});
