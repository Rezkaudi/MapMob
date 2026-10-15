import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { API_BASE_URL } from '../../../core/config/api-base-url';

export const SETTINGS_URL = 'https://api.test/admin/settings';

/** One settings http repository against a fake server. */
export function setUpSettingsRepository<T>(repositoryType: Type<T>) {
  TestBed.configureTestingModule({
    providers: [
      repositoryType,
      provideHttpClient(),
      provideHttpClientTesting(),
      { provide: API_BASE_URL, useValue: 'https://api.test' },
    ],
  });
  return {
    repository: TestBed.inject(repositoryType),
    http: TestBed.inject(HttpTestingController),
  };
}
