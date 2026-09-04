import { TestBed } from '@angular/core/testing';
import { USE_MOCK_API, provideUseMockApi } from './use-mock-api';
import { environment } from '../../../environments/environment';

describe('USE_MOCK_API', () => {
  it('gives the mock-api flag from the environment file', () => {
    TestBed.configureTestingModule({ providers: [provideUseMockApi()] });

    expect(TestBed.inject(USE_MOCK_API)).toBe(environment.useMockApi);
  });
});
