import { Location } from '@angular/common';
import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MERCHANT_SUPPORT_URL } from '../../../core/config/merchant-support-url';
import { AuthRepository } from '../../auth/data/auth.repository';
import { MerchantAuthRepository } from '../data/merchant-auth.repository';

export const SUPPORT_URL = 'mailto:help@example.com';

/** Renders one merchant sign-in page with a fake repository and throwaway routes. */
export function renderMerchantAuthPage<TPage>(
  page: Type<TPage>,
  repository: Partial<MerchantAuthRepository> = {},
) {
  localStorage.clear();
  TestBed.configureTestingModule({
    providers: [
      provideRouter([{ path: '**', children: [] }]),
      { provide: AuthRepository, useValue: {} },
      { provide: MerchantAuthRepository, useValue: repository },
      { provide: MERCHANT_SUPPORT_URL, useValue: SUPPORT_URL },
    ],
  });
  const fixture = TestBed.createComponent(page);
  fixture.detectChanges();
  const element = fixture.nativeElement as HTMLElement;
  return {
    fixture,
    element,
    currentPath: () => TestBed.inject(Location).path(),
    type(selector: string, value: string) {
      const input = element.querySelector<HTMLInputElement>(selector)!;
      input.value = value;
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();
    },
    async submit() {
      element.querySelector<HTMLButtonElement>('button[type="submit"]')!.click();
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();
    },
  };
}
