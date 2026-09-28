import { Injectable } from '@angular/core';
import { Observable, from, map, switchMap } from 'rxjs';
import { mockResponse } from '../../../../mock/mock-delay';
import { StoreProfile } from '../models/store-profile';
import { StoreProfileUpdate } from '../models/store-profile-update';
import { applyStoreProfileUpdate } from './store-profile-changes';
import { StoreProfileRepository } from './store-profile.repository';

// Loaded on first use, so the seed stays out of the initial bundle.
const loadSeed = () => from(import('./store-profile-mock-seed'));

@Injectable()
export class StoreProfileMockRepository implements StoreProfileRepository {
  private savedProfile: StoreProfile | null = null;

  getProfile(): Observable<StoreProfile> {
    return this.readSaved().pipe(switchMap((profile) => mockResponse(profile)));
  }

  saveProfile(update: StoreProfileUpdate): Observable<StoreProfile> {
    return this.readSaved().pipe(
      switchMap((saved) => {
        const coverUrl = update.cover ? URL.createObjectURL(update.cover) : null;
        this.savedProfile = applyStoreProfileUpdate(saved, update, coverUrl);
        return mockResponse(this.savedProfile);
      }),
    );
  }

  private readSaved(): Observable<StoreProfile> {
    return loadSeed().pipe(map((seed) => this.savedProfile ?? seed.STORE_PROFILE_SEED));
  }
}
