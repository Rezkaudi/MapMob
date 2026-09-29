import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { CLOCK } from '../../../core/config/clock';
import { MerchantSubscriptionMockRepository } from './merchant-subscription-mock.repository';

const NOW = new Date('2026-09-29T12:00:00.000Z');

function createRepository(): MerchantSubscriptionMockRepository {
  TestBed.configureTestingModule({
    providers: [MerchantSubscriptionMockRepository, { provide: CLOCK, useValue: () => NOW }],
  });
  return TestBed.inject(MerchantSubscriptionMockRepository);
}

describe('MerchantSubscriptionMockRepository', () => {
  it("serves the frame's page: the basic plan, three plans and three periods", async () => {
    const overview = await firstValueFrom(createRepository().getOverview());

    expect(overview.current.plan.name).toBe('الباقة الأساسية');
    expect(overview.plans.map((plan) => plan.tier)).toEqual(['free', 'basic', 'featured']);
    expect(overview.history).toHaveLength(3);
    expect(overview.usage.products).toEqual({ used: 8, limit: 10 });
    expect(overview.pendingRequest).toBeNull();
  });

  it('keeps a request as pending and shows it on the next read', async () => {
    const repository = createRepository();

    const request = await firstValueFrom(
      repository.requestPlanChange({ kind: 'upgrade', planId: 'plan-featured', term: 'monthly' }),
    );

    expect(request).toEqual(
      expect.objectContaining({
        kind: 'upgrade',
        plan: { id: 'plan-featured', name: 'الباقة المميزة' },
        status: 'pending',
        createdAt: NOW.toISOString(),
      }),
    );
    expect((await firstValueFrom(repository.getOverview())).pendingRequest).toEqual(request);
  });

  it('refuses a second request while one waits', async () => {
    const repository = createRepository();
    const draft = { kind: 'renewal', planId: 'plan-basic', term: 'monthly' } as const;
    await firstValueFrom(repository.requestPlanChange(draft));

    await expect(firstValueFrom(repository.requestPlanChange(draft))).rejects.toThrow(
      'لديك طلب قيد المراجعة بالفعل.',
    );
  });

  it('refuses a plan that is not sold', async () => {
    const draft = { kind: 'upgrade', planId: 'plan-gold', term: 'monthly' } as const;

    await expect(firstValueFrom(createRepository().requestPlanChange(draft))).rejects.toThrow(
      'هذه الباقة غير متاحة.',
    );
  });
});
