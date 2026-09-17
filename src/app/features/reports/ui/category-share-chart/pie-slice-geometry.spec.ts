import { buildPieSlices } from './pie-slice-geometry';

const CIRCLE = { centerX: 100, centerY: 100, radius: 100, labelRadiusRatio: 0.5 };

describe('buildPieSlices', () => {
  it('starts the first slice at three o’clock and turns clockwise', () => {
    const [quarter] = buildPieSlices([25, 75], CIRCLE);

    expect(quarter.path).toBe('M 100 100 L 200 100 A 100 100 0 0 1 100 200 Z');
  });

  it('uses the large arc flag for a slice wider than half the circle', () => {
    const [, rest] = buildPieSlices([25, 75], CIRCLE);

    expect(rest.path).toBe('M 100 100 L 100 200 A 100 100 0 1 1 200 100 Z');
  });

  it('places each label in the middle of its slice at the label radius', () => {
    const [half] = buildPieSlices([50, 50], CIRCLE);

    expect(half.labelX).toBeCloseTo(100);
    expect(half.labelY).toBeCloseTo(150);
  });

  it('sizes slices by their part of the total, even when shares do not add to 100', () => {
    expect(buildPieSlices([1, 1], CIRCLE)).toEqual(buildPieSlices([50, 50], CIRCLE));
  });

  it('draws nothing when there is nothing to share', () => {
    expect(buildPieSlices([], CIRCLE)).toEqual([]);
    expect(buildPieSlices([0, 0], CIRCLE)).toEqual([]);
  });

  it('draws a single full share as a whole circle', () => {
    const [whole] = buildPieSlices([100], CIRCLE);

    expect(whole.path).toBe('M 200 100 A 100 100 0 1 1 0 100 A 100 100 0 1 1 200 100 Z');
  });
});
