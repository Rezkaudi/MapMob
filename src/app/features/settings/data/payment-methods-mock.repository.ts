import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { PaymentMethod } from '../models/payment-method';
import { PaymentMethodDraft } from '../models/payment-method-draft';
import { PaymentMethodsRepository } from './payment-methods.repository';
import { SettingsMockDatabaseLoader } from './settings-mock-database-loader';

@Injectable()
export class PaymentMethodsMockRepository implements PaymentMethodsRepository {
  private readonly loader = inject(SettingsMockDatabaseLoader);

  getMethods(): Observable<readonly PaymentMethod[]> {
    return this.loader.request((database) => database.paymentMethods.list());
  }

  addMethod(draft: PaymentMethodDraft): Observable<PaymentMethod> {
    return this.loader.request((database) => database.paymentMethods.add(draft));
  }

  updateMethod(id: string, draft: PaymentMethodDraft): Observable<PaymentMethod> {
    return this.loader.request((database) => database.paymentMethods.update(id, draft));
  }
}
