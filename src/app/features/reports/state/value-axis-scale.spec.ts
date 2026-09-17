import { buildValueAxisScale } from './value-axis-scale';

describe('buildValueAxisScale', () => {
  it('splits the axis into four steps of a round ten, as the design draws 0 to 120 by 30', () => {
    expect(buildValueAxisScale(102)).toEqual({ max: 120, tickAmount: 4 });
  });

  it('keeps the top value when it already lands on a step', () => {
    expect(buildValueAxisScale(120)).toEqual({ max: 120, tickAmount: 4 });
  });

  it('still draws a scale when every value is zero', () => {
    expect(buildValueAxisScale(0)).toEqual({ max: 40, tickAmount: 4 });
  });
});
