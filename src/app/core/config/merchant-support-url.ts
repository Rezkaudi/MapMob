import { InjectionToken, Provider } from '@angular/core';
import { environment } from '../../../environments/environment';

/** Where the merchant login's "تواصل مع إدارة MapMob" link goes (mailto:, tel: or a page). */
export const MERCHANT_SUPPORT_URL = new InjectionToken<string>('MERCHANT_SUPPORT_URL');

export function provideMerchantSupportUrl(): Provider {
  return { provide: MERCHANT_SUPPORT_URL, useValue: environment.merchantSupportUrl };
}
