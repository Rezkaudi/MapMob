import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { PaymentMethodsHttpRepository } from './payment-methods-http.repository';

const BASE_URL = 'https://api.test';
const METHODS_URL = `${BASE_URL}/settings/payment-methods`;
const DRAFT = { name: 'دفع نقدي', kind: 'manual', status: 'active' } as const;

describe('PaymentMethodsHttpRepository', () => {
  let repository: PaymentMethodsHttpRepository;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PaymentMethodsHttpRepository,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_BASE_URL, useValue: BASE_URL },
      ],
    });
    repository = TestBed.inject(PaymentMethodsHttpRepository);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('asks for the payment methods', () => {
    repository.getMethods().subscribe();

    http.expectOne({ method: 'GET', url: METHODS_URL }).flush([]);
  });

  it('adds a method', () => {
    repository.addMethod(DRAFT).subscribe();

    const request = http.expectOne({ method: 'POST', url: METHODS_URL });
    expect(request.request.body).toEqual(DRAFT);
    request.flush({});
  });

  it('updates a method', () => {
    repository.updateMethod('payment-method-1', DRAFT).subscribe();

    const request = http.expectOne({ method: 'PUT', url: `${METHODS_URL}/payment-method-1` });
    expect(request.request.body).toEqual(DRAFT);
    request.flush({});
  });
});
