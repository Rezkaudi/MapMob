import { firstValueFrom } from 'rxjs';
import { PaymentMockDataLoader } from './payment-mock-data-loader';

describe('PaymentMockDataLoader', () => {
  it('hands the loaded mock data to the work it is given', async () => {
    const loader = new PaymentMockDataLoader();

    const names = await firstValueFrom(
      loader.request(({ formOptions }) => formOptions.plans.map((plan) => plan.name)),
    );

    expect(names).toContain('الباقة الأساسية');
  });

  it('loads the data once and reuses it', async () => {
    const loader = new PaymentMockDataLoader();

    const [first, second] = await Promise.all([
      firstValueFrom(loader.request((data) => data.payments)),
      firstValueFrom(loader.request((data) => data.payments)),
    ]);

    expect(first).toBe(second);
  });
});
