import { describe, expect, it } from 'vitest';
import { Subscription } from '../models/subscription';
import { querySubscriptions } from './subscription-mock-query';

function entry(patch: Partial<Subscription> = {}): Subscription {
  return {
    id: 'sub-1',
    companyName: 'صيدلية الحياة',
    planName: 'أساسية',
    planTier: 'basic',
    price: 12,
    currencySymbol: '$',
    startedOn: '2024-01-12',
    endsOn: '2024-01-26',
    status: 'active',
    ...patch,
  };
}

const entries: readonly Subscription[] = [
  entry({ id: 'a', companyName: 'صيدلية الحياة', planTier: 'basic', startedOn: '2024-03-01' }),
  entry({ id: 'b', companyName: 'مطعم الشام', planTier: 'free', status: 'paused', startedOn: '2024-01-05' }),
  entry({ id: 'c', companyName: 'متجر النور', planTier: 'featured', status: 'expired', startedOn: '2024-02-10' }),
];

const page = { pageIndex: 0, pageSize: 10 };

describe('querySubscriptions', () => {
  it('returns every subscription when nothing narrows it', () => {
    expect(querySubscriptions(entries, page).totalCount).toBe(3);
  });

  it('keeps only the asked-for package tier', () => {
    const result = querySubscriptions(entries, { ...page, tier: 'featured' });

    expect(result.items.map((item) => item.id)).toEqual(['c']);
  });

  it('keeps only the asked-for status', () => {
    const result = querySubscriptions(entries, { ...page, status: 'paused' });

    expect(result.items.map((item) => item.id)).toEqual(['b']);
  });

  it('searches the company name', () => {
    const result = querySubscriptions(entries, { ...page, search: 'مطعم' });

    expect(result.items.map((item) => item.id)).toEqual(['b']);
  });

  it('keeps subscriptions that started inside the range, both ends included', () => {
    const result = querySubscriptions(entries, {
      ...page,
      subscribedFrom: '2024-02-01',
      subscribedTo: '2024-03-01',
    });

    expect(result.items.map((item) => item.id)).toEqual(['a', 'c']);
  });

  it('sorts newest first by start date', () => {
    const result = querySubscriptions(entries, { ...page, sort: 'newest' });

    expect(result.items.map((item) => item.id)).toEqual(['a', 'c', 'b']);
  });

  it('pages the matches', () => {
    const result = querySubscriptions(entries, { pageIndex: 1, pageSize: 2 });

    expect(result.items).toHaveLength(1);
    expect(result.totalCount).toBe(3);
  });
});
