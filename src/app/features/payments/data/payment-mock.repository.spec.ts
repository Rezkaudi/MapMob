import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { PaymentMockRepository } from './payment-mock.repository';

describe('PaymentMockRepository', () => {
  let repository: PaymentMockRepository;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [PaymentMockRepository] });
    repository = TestBed.inject(PaymentMockRepository);
  });

  it('pages the payments', async () => {
    const page = await firstValueFrom(repository.getPayments({ pageIndex: 0, pageSize: 4 }));

    expect(page.items).toHaveLength(4);
    expect(page.totalCount).toBeGreaterThan(4);
  });

  it('summarizes the payments', async () => {
    const summary = await firstValueFrom(repository.getSummary());

    expect(summary.transactionCount).toBeGreaterThan(0);
  });

  it('finds one payment detail by id', async () => {
    const detail = await firstValueFrom(repository.getPaymentDetail('payment-10254'));

    expect(detail.transactionNumber).toBe('#PAY-10254');
    expect(detail.company.name).toBe('صيدلية الحياة');
  });

  it('fails for a payment that does not exist', async () => {
    await expect(firstValueFrom(repository.getPaymentDetail('missing'))).rejects.toThrowError();
  });

  it('exports every matching payment as a csv file', async () => {
    const file = await firstValueFrom(
      repository.exportPayments({ pageIndex: 0, pageSize: 4, search: 'الحياة' }),
    );

    expect(await file.text()).toContain('#PAY-10254');
  });
});
