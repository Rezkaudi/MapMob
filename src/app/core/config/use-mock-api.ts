import { InjectionToken, Provider } from '@angular/core';
import { environment } from '../../../environments/environment';

export const USE_MOCK_API = new InjectionToken<boolean>('USE_MOCK_API');

export function provideUseMockApi(): Provider {
  return { provide: USE_MOCK_API, useValue: environment.useMockApi };
}
