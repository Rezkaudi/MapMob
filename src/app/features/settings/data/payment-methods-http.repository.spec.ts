import { HttpTestingController } from '@angular/common/http/testing';
import { firstValueFrom } from 'rxjs';
import { SETTINGS_URL, setUpSettingsRepository } from '../testing/settings-http-testing';
import { PaymentMethodsHttpRepository } from './payment-methods-http.repository';

const METHODS_URL = `${SETTINGS_URL}/paymentmethods`;
const CASH = { id: '1', name: 'cash', kind: 'manual', status: 'active' } as const;
const DRAFT = { name: 'cash', kind: 'manual', status: 'active' } as const;

describe('PaymentMethodsHttpRepository', () => {
  let repository: PaymentMethodsHttpRepository;
  let http: HttpTestingController;

  beforeEach(() => ({ repository, http } = setUpSettingsRepository(PaymentMethodsHttpRepository)));

  afterEach(() => http.verify());

  it('reads the methods', async () => {
    const response = firstValueFrom(repository.getMethods());

    http.expectOne(METHODS_URL).flush([CASH]);

    expect(await response).toEqual([CASH]);
  });

  it('adds a method', async () => {
    const response = firstValueFrom(repository.addMethod(DRAFT));

    const request = http.expectOne(METHODS_URL);
    expect(request.request.method).toBe('POST');
    request.flush({ data: CASH });

    expect(await response).toEqual(CASH);
  });

  it('saves a method by its id', async () => {
    const response = firstValueFrom(repository.updateMethod('1', DRAFT));

    const request = http.expectOne(`${METHODS_URL}/1`);
    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toEqual(DRAFT);
    request.flush({ data: CASH });

    expect(await response).toEqual(CASH);
  });
});
