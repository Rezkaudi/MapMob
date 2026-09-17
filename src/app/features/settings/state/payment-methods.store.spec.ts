import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { PaymentMethodsRepository } from '../data/payment-methods.repository';
import { buildPaymentMethod } from '../testing/settings-fixture';
import { PaymentMethodsStore } from './payment-methods.store';

const CASH = buildPaymentMethod();
const TRANSFER_DRAFT = { name: 'تحويل بنكي', kind: 'electronic', status: 'active' } as const;

function createStore(overrides: Partial<PaymentMethodsRepository> = {}) {
  const repository: Partial<PaymentMethodsRepository> = {
    getMethods: () => of([CASH]),
    addMethod: (draft) => of({ id: 'payment-method-2', ...draft }),
    updateMethod: (id, draft) => of({ id, ...draft }),
    ...overrides,
  };
  TestBed.configureTestingModule({
    providers: [PaymentMethodsStore, { provide: PaymentMethodsRepository, useValue: repository }],
  });
  const store = TestBed.inject(PaymentMethodsStore);
  store.loadMethods();
  return store;
}

describe('PaymentMethodsStore', () => {
  it('loads the methods', () => {
    const store = createStore();

    expect(store.methods()).toEqual([CASH]);
    expect(store.hasNoMethods()).toBe(false);
  });

  it('reports a failed load', () => {
    const store = createStore({ getMethods: () => throwError(() => new Error('تعذر التحميل')) });

    expect(store.error()).toBe('تعذر التحميل');
  });

  it('adds a method through the dialog and confirms it', async () => {
    const store = createStore();
    store.openAddDialog();
    expect(store.dialog()).toEqual({ mode: 'add' });

    expect(await store.saveMethod(TRANSFER_DRAFT)).toBe(true);

    expect(store.methods()).toEqual([CASH, { id: 'payment-method-2', ...TRANSFER_DRAFT }]);
    expect(store.dialog()).toBeNull();
    expect(store.savedMode()).toBe('add');
  });

  it('edits a method in place', async () => {
    const store = createStore();
    store.openEditDialog(CASH);

    await store.saveMethod({ ...TRANSFER_DRAFT, name: 'نقداً' });

    expect(store.methods()).toEqual([{ id: CASH.id, ...TRANSFER_DRAFT, name: 'نقداً' }]);
    expect(store.savedMode()).toBe('edit');
  });

  it('keeps the dialog open with the error when a save fails, and clears it on close', async () => {
    const store = createStore({ addMethod: () => throwError(() => new Error('الاسم مستخدم')) });
    store.openAddDialog();

    expect(await store.saveMethod(TRANSFER_DRAFT)).toBe(false);
    expect(store.dialog()).toEqual({ mode: 'add' });
    expect(store.saveError()).toBe('الاسم مستخدم');

    store.closeDialog();
    expect(store.saveError()).toBeNull();
  });
});
