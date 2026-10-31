import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { LiveEnvelope } from '../../../core/http/live-envelope';
import { StoreProfile } from '../models/store-profile';
import { StoreProfileUpdate } from '../models/store-profile-update';
import { LiveOwnerStore } from './live-owner-store';
import { toStoreProfileFormData } from './store-profile-form-data';
import { StoreProfileRepository } from './store-profile.repository';
import { toStoreProfile } from './to-store-profile';

@Injectable()
export class StoreProfileHttpRepository implements StoreProfileRepository {
  private readonly httpClient = inject(HttpClient);
  private readonly storeUrl = `${inject(API_BASE_URL)}/owner/store`;

  getProfile(): Observable<StoreProfile> {
    return this.httpClient
      .get<LiveEnvelope<LiveOwnerStore>>(this.storeUrl)
      .pipe(map(({ data }) => toStoreProfile(data)));
  }

  saveProfile(update: StoreProfileUpdate): Observable<StoreProfile> {
    return this.httpClient
      .post<LiveEnvelope<LiveOwnerStore>>(this.storeUrl, toStoreProfileFormData(update))
      .pipe(map(({ data }) => toStoreProfile(data)));
  }
}
