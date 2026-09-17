import { ValueAxisScale } from '../models/value-axis-scale';

const TICK_AMOUNT = 4;
const STEP_ROUNDING = 10;

export function buildValueAxisScale(highestValue: number): ValueAxisScale {
  const roughStep = highestValue / TICK_AMOUNT;
  const step = Math.max(STEP_ROUNDING, Math.ceil(roughStep / STEP_ROUNDING) * STEP_ROUNDING);
  return { max: step * TICK_AMOUNT, tickAmount: TICK_AMOUNT };
}
