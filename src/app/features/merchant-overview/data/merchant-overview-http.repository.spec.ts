import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { MerchantOverviewHttpRepository } from './merchant-overview-http.repository';

describe('MerchantOverviewHttpRepository', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MerchantOverviewHttpRepository,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_BASE_URL, useValue: 'https://api.test' },
      ],
    });
  });

  it('reads the overview for the signed-in merchant', async () => {
    const response = firstValueFrom(TestBed.inject(MerchantOverviewHttpRepository).getOverview());

    const request = TestBed.inject(HttpTestingController).expectOne(
      'https://api.test/owner/overview',
    );
    expect(request.request.method).toBe('GET');
    request.flush({ placeName: 'x' });
    expect((await response).placeName).toBe('x');
  });

  it('asks for one period of the performance chart', async () => {
    const response = firstValueFrom(
      TestBed.inject(MerchantOverviewHttpRepository).getPerformance('weekly'),
    );

    const request = TestBed.inject(HttpTestingController).expectOne(
      (one) => one.url === 'https://api.test/owner/overview/performance',
    );
    expect(request.request.params.get('period')).toBe('weekly');
    request.flush({ points: [], dailyAverageViewCount: 0, peakDay: null });
    expect((await response).peakDay).toBeNull();
  });
});
