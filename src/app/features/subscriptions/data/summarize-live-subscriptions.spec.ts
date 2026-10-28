import { PackagePlan } from '../models/package-plan';
import { Subscription } from '../models/subscription';
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
  limits: { adsPerMonth: 1, activeOffers: 1, galleryImages: 1, videos: null },
  features: [],
  isActive: true,
};
const ROW: Subscription = {
  id: '1',
  companyName: 'أ',
  planName: 'ذهبية',
  planTier: 'featured',
  price: 10,
  currencySymbol: 'ل.س',
  startedOn: '2026-10-01',
  endsOn: '2026-10-20',
  status: 'active',
};

describe('summarizeLiveSubscriptions', () => {
  it('takes the active counts from the server and the rest from the lists', () => {
    const summary = summarizeLiveSubscriptions(
      [PLAN, { ...PLAN, id: '2', name: 'فضية', subscriberCount: 1, isActive: false }],
      [ROW, { ...ROW, id: '2', endsOn: '2026-12-30' }, { ...ROW, id: '3', status: 'expired' }],
      { total_count: 4, active_count: 3 },
      '2026-10-14',
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
      summarizeLiveSubscriptions([], [], { total_count: 0, active_count: 0 }, '2026-10-14'),
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
