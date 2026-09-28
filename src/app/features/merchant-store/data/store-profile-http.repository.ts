import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { StoreProfile } from '../models/store-profile';
import { StoreProfileUpdate } from '../models/store-profile-update';
import { toStoreProfileFormData } from './store-profile-form-data';
import { StoreProfileRepository } from './store-profile.repository';

@Injectable()
export class StoreProfileHttpRepository implements StoreProfileRepository {
  private readonly httpClient = inject(HttpClient);
  private readonly apiBaseUrl = inject(API_BASE_URL);

  getProfile(): Observable<StoreProfile> {
    return this.httpClient.get<StoreProfile>(`${this.apiBaseUrl}/owner/place`);
  }

  saveProfile(update: StoreProfileUpdate): Observable<StoreProfile> {
    return this.httpClient.put<StoreProfile>(
      `${this.apiBaseUrl}/owner/place`,
      toStoreProfileFormData(update),
    );
  }
}
