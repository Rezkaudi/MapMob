import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { PaymentMockDataLoader } from './payment-mock-data-loader';
import { PaymentMockRepository } from './payment-mock.repository';

describe('PaymentMockRepository', () => {
  let repository: PaymentMockRepository;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [PaymentMockDataLoader, PaymentMockRepository] });
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

  it('saves the changes to a payment and lists it with them', async () => {
    const changes = { amount: 40, currency: 'SYP' as const, paidAt: '2026-11-01', notes: 'تصحيح' };

    const saved = await firstValueFrom(repository.updatePayment('payment-10254', changes));
    const detail = await firstValueFrom(repository.getPaymentDetail('payment-10254'));

    expect(saved).toMatchObject({ id: 'payment-10254', ...changes });
    expect(detail).toMatchObject({ ...changes, company: { name: 'صيدلية الحياة' } });
  });

  it('fails to change a payment that does not exist', async () => {
    const changes = { amount: 1, currency: 'USD' as const, paidAt: '2026-11-01', notes: '' };

    await expect(
      firstValueFrom(repository.updatePayment('missing', changes)),
    ).rejects.toThrowError();
  });

  it('deletes a payment so the list no longer has it', async () => {
    const before = await firstValueFrom(repository.getPayments({ pageIndex: 0, pageSize: 4 }));

    await firstValueFrom(repository.deletePayment('payment-10254'));
    const after = await firstValueFrom(repository.getPayments({ pageIndex: 0, pageSize: 4 }));

    expect(after.totalCount).toBe(before.totalCount - 1);
    await expect(
      firstValueFrom(repository.getPaymentDetail('payment-10254')),
    ).rejects.toThrowError();
  });

  it('exports every matching payment as a csv file', async () => {
    const file = await firstValueFrom(
      repository.exportPayments({ pageIndex: 0, pageSize: 4, search: 'الحياة' }),
    );

    expect(await file.text()).toContain('#PAY-10254');
  });
});
