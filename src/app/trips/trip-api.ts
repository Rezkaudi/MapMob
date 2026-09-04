import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../core/api-base-url';
import { Trip } from './trip';

@Injectable({ providedIn: 'root' })
export class TripApi {
  private readonly httpClient = inject(HttpClient);
  private readonly apiBaseUrl = inject(API_BASE_URL);

  getTrips(): Observable<readonly Trip[]> {
    return this.httpClient.get<readonly Trip[]>(`${this.apiBaseUrl}/trips`);
  }
}
