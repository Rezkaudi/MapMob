import { TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { MERCHANT_SUPPORT_URL, provideMerchantSupportUrl } from './merchant-support-url';

describe('MERCHANT_SUPPORT_URL', () => {
  it('gives the "تواصل مع إدارة MapMob" link from the environment file', () => {
    TestBed.configureTestingModule({ providers: [provideMerchantSupportUrl()] });

    expect(TestBed.inject(MERCHANT_SUPPORT_URL)).toBe(environment.merchantSupportUrl);
    expect(environment.merchantSupportUrl).toBeTruthy();
  });
});
