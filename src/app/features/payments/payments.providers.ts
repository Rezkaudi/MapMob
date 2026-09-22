import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { environment } from '../../../environments/environment';
import { PaymentHttpRepository } from './data/payment-http.repository';
import { PaymentMockDataLoader } from './data/payment-mock-data-loader';
import { PaymentMockRepository } from './data/payment-mock.repository';
import { PaymentRepository } from './data/payment.repository';

/** ⚠ The `useMockApi` branch is temporary — delete it and the mock files once the API exists. */
export function providePaymentsFeature(): EnvironmentProviders {
  return makeEnvironmentProviders([
    PaymentMockDataLoader,
    {
      provide: PaymentRepository,
      useClass: environment.useMockApi ? PaymentMockRepository : PaymentHttpRepository,
    },
  ]);
}
