import { Observable } from 'rxjs';
import { PaymentMethod } from '../models/payment-method';
import { PaymentMethodDraft } from '../models/payment-method-draft';

export abstract class PaymentMethodsRepository {
  abstract getMethods(): Observable<readonly PaymentMethod[]>;
  abstract addMethod(draft: PaymentMethodDraft): Observable<PaymentMethod>;
  abstract updateMethod(id: string, draft: PaymentMethodDraft): Observable<PaymentMethod>;
}
