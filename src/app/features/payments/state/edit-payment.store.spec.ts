import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { PaymentRepository } from '../data/payment.repository';
import { PaymentChanges } from '../models/payment-changes';
import { buildPaymentDetail } from '../testing/payment-fixture';
import { EditPaymentStore } from './edit-payment.store';

const PAYMENT = buildPaymentDetail({
  amount: 25,
  currency: 'USD',
  paidAt: '2026-10-01',
  notes: 'قديم',
});

function createStore(
  updatePayment: PaymentRepository['updatePayment'] = (id, changes) =>
    of({ ...PAYMENT, ...changes }),
) {
  const sent: { id: string; changes: PaymentChanges }[] = [];
  TestBed.configureTestingModule({
    providers: [
      EditPaymentStore,
      {
        provide: PaymentRepository,
        useValue: {
          updatePayment: (id: string, changes: PaymentChanges) => {
            sent.push({ id, changes });
            return updatePayment(id, changes);
          },
        },
      },
    ],
  });
  return { store: TestBed.inject(EditPaymentStore), sent };
}

describe('EditPaymentStore', () => {
  it('starts closed', () => {
    expect(createStore().store.isOpen()).toBe(false);
  });

  it('opens filled with the payment as it is now', () => {
    const { store } = createStore();

    store.open(PAYMENT);

    expect(store.isOpen()).toBe(true);
    expect(store.companyName()).toBe('صيدلية الحياة');
    expect(store.amount()).toBe(25);
    expect(store.currency()).toBe('USD');
    expect(store.paidAt()).toBe('2026-10-01');
    expect(store.notes()).toBe('قديم');
  });

  it('sends the edited fields, then closes', async () => {
    const { store, sent } = createStore();
    store.open(PAYMENT);
    store.setAmount(40);
    store.setCurrency('SYP');
    store.setPaidAt('2026-10-05');
    store.setNotes('مصحح');

    await store.submit();

    expect(sent).toEqual([
      {
        id: PAYMENT.id,
        changes: { amount: 40, currency: 'SYP', paidAt: '2026-10-05', notes: 'مصحح' },
      },
    ]);
    expect(store.isOpen()).toBe(false);
    expect(store.saveError()).toBeNull();
  });

  it('cannot save a zero amount or an empty day', () => {
    const { store } = createStore();
    store.open(PAYMENT);

    store.setAmount(0);
    expect(store.canSubmit()).toBe(false);

    store.setAmount(10);
    store.setPaidAt('');
    expect(store.canSubmit()).toBe(false);

    store.setPaidAt('2026-10-05');
    expect(store.canSubmit()).toBe(true);
  });

  it('stays open and says why when the save fails', async () => {
    const { store } = createStore(() => throwError(() => new Error('تعذر حفظ الدفعة')));
    store.open(PAYMENT);

    await store.submit();

    expect(store.isOpen()).toBe(true);
    expect(store.isSaving()).toBe(false);
    expect(store.saveError()).toBe('تعذر حفظ الدفعة');
  });

  it('forgets everything when closed', () => {
    const { store } = createStore();
    store.open(PAYMENT);
    store.setNotes('مسودة');

    store.close();

    expect(store.isOpen()).toBe(false);
    expect(store.notes()).toBe('');
  });
});
