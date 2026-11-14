import { LivePlan } from './live-plan';
import { toLivePlanSlug } from './live-plan-slug';

const plan = (slug: string, price: number) => ({ slug, price }) as LivePlan;
const PLANS = [plan('saver-plan', 100), plan('golden-plan', 150000), plan('test-plan', 1000)];

describe('toLivePlanSlug', () => {
  it('sends "free" for the free tier', () => {
    expect(toLivePlanSlug('free', PLANS)).toBe('free');
  });

  it('sends the slug of the dearest plan for the featured tier', () => {
    expect(toLivePlanSlug('featured', PLANS)).toBe('golden-plan');
  });

  it('sends the slug of the first cheaper paid plan for the basic tier', () => {
    expect(toLivePlanSlug('basic', PLANS)).toBe('saver-plan');
  });

  it('keeps the tier word when no plan has that tier', () => {
    expect(toLivePlanSlug('basic', [plan('golden-plan', 150000)])).toBe('basic');
  });
});
