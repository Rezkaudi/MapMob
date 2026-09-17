import { PaymentMethod } from '../models/payment-method';
import { PaymentMethodDraft } from '../models/payment-method-draft';
import { nextMockId } from './next-mock-id';

const PAYMENT_METHOD_ID_PREFIX = 'payment-method-';

export class PaymentMethodMockRecords {
  constructor(private methods: readonly PaymentMethod[]) {}

  list(): readonly PaymentMethod[] {
    return this.methods;
  }

  add(draft: PaymentMethodDraft): PaymentMethod {
    const method = { id: nextMockId(PAYMENT_METHOD_ID_PREFIX, this.methods), ...draft };
    this.methods = [...this.methods, method];
    return method;
  }

  update(id: string, draft: PaymentMethodDraft): PaymentMethod {
    if (!this.methods.some((method) => method.id === id)) {
      throw new Error('لم يتم العثور على وسيلة الدفع');
    }
    const updated = { id, ...draft };
    this.methods = this.methods.map((method) => (method.id === id ? updated : method));
    return updated;
  }
}
