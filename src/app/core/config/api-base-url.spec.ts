import { TestBed } from '@angular/core/testing';
import { API_BASE_URL, provideApiBaseUrl } from './api-base-url';
import { environment } from '../../../environments/environment';

describe('API_BASE_URL', () => {
  it('gives the base URL from the environment file', () => {
    TestBed.configureTestingModule({ providers: [provideApiBaseUrl()] });

    expect(TestBed.inject(API_BASE_URL)).toBe(environment.apiBaseUrl);
  });
});
