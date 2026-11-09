import { PackagePlan } from '../models/package-plan';
import { summarizeLiveSubscriptions } from './summarize-live-subscriptions';

const PLAN: PackagePlan = {
  id: '1',
  name: 'ذهبية',
  tier: 'featured',
  tagline: '',
  badge: null,
  monthlyPrice: 10,
  yearlyPrice: null,
  currency: 'SYP',
  subscriberCount: 2,
  limits: { adsPerMonth: 1, activeOffers: 1, galleryImages: 1, videos: null, activeStories: 2 },
  features: [],
  isActive: true,
};
describe('summarizeLiveSubscriptions', () => {
  it('takes the counts from the server summary and the plans', () => {
    const summary = summarizeLiveSubscriptions(
      [PLAN, { ...PLAN, id: '2', name: 'فضية', subscriberCount: 1, isActive: false }],
      { total_count: 4, active_count: 3, ending_soon_count: 1 },
    );

    expect(summary).toEqual({
      topPlanName: 'ذهبية',
      topPlanSubscriberCount: 2,
      availablePlanCount: 1,
      endingSoonCount: 1,
      activeSubscriberCount: 3,
      activeSubscriberShare: 3 / 4,
    });
  });

  it('reports zeros when there is nothing yet', () => {
    expect(
      summarizeLiveSubscriptions([], { total_count: 0, active_count: 0 }),
    ).toEqual({
      topPlanName: '',
      topPlanSubscriberCount: 0,
      availablePlanCount: 0,
      endingSoonCount: 0,
      activeSubscriberCount: 0,
      activeSubscriberShare: 0,
    });
  });
});
