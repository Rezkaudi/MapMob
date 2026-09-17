import { buildPaymentMethod } from '../testing/settings-fixture';
import { buildSettingsMockSeed } from '../testing/settings-mock-seed-fixture';
import { PaymentMethodMockRecords } from './payment-method-mock-records';

function createRecords() {
  const seed = buildSettingsMockSeed();
  return new PaymentMethodMockRecords(seed.paymentMethods);
}

describe('PaymentMethodMockRecords', () => {
  it('lists the payment methods', () => {
    expect(createRecords().list()).toEqual([buildPaymentMethod()]);
  });

  it('adds a method with the next id', () => {
    const records = createRecords();

    const added = records.add({
      name: 'تحويل بنكي',
      kind: 'electronic',
      status: 'suspended',
    });

    expect(added).toEqual({
      id: 'payment-method-2',
      name: 'تحويل بنكي',
      kind: 'electronic',
      status: 'suspended',
    });
    expect(records.list()).toHaveLength(2);
  });

  it('updates a method in place, and refuses one that does not exist', () => {
    const records = createRecords();
    const draft = { name: 'نقداً عند الاستلام', kind: 'manual', status: 'suspended' } as const;

    expect(records.update('payment-method-1', draft)).toEqual({
      id: 'payment-method-1',
      ...draft,
    });
    expect(() => records.update('missing', draft)).toThrow('لم يتم العثور على وسيلة الدفع');
  });
});
