import { Observable } from 'rxjs';
import { StoreProfile } from '../models/store-profile';
import { StoreProfileUpdate } from '../models/store-profile-update';

export abstract class StoreProfileRepository {
  abstract getProfile(): Observable<StoreProfile>;
  abstract saveProfile(update: StoreProfileUpdate): Observable<StoreProfile>;
}
