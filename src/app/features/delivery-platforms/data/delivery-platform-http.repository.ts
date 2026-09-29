import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { toListQueryParams } from '../../../shared/data/list-query-params';
import { ListQuery } from '../../../shared/models/list-query';
import { DeliveryPlatformDraft } from '../models/delivery-platform-draft';
import { DeliveryPlatformEntry } from '../models/delivery-platform-entry';
import { DeliveryPlatformPage } from '../models/delivery-platform-page';
import { DeliveryPlatformStatus } from '../models/delivery-platform-status';
import { DeliveryPlatformSummary } from '../models/delivery-platform-summary';
import { LinkedStore } from '../models/linked-store';
import { toDeliveryPlatformFormData } from './delivery-platform-form-data';
import { DeliveryPlatformRepository } from './delivery-platform.repository';

@Injectable()
export class DeliveryPlatformHttpRepository implements DeliveryPlatformRepository {
  private readonly httpClient = inject(HttpClient);
  private readonly platformsUrl = `${inject(API_BASE_URL)}/delivery-platforms`;

  getPlatforms(query: ListQuery): Observable<DeliveryPlatformPage> {
    return this.httpClient.get<DeliveryPlatformPage>(this.platformsUrl, {
      params: toListQueryParams(query),
    });
  }

  getSummary(): Observable<DeliveryPlatformSummary> {
    return this.httpClient.get<DeliveryPlatformSummary>(`${this.platformsUrl}/summary`);
  }

  createPlatform(draft: DeliveryPlatformDraft): Observable<DeliveryPlatformEntry> {
    return this.httpClient.post<DeliveryPlatformEntry>(
      this.platformsUrl,
      toDeliveryPlatformFormData(draft),
    );
  }

  updatePlatform(id: string, draft: DeliveryPlatformDraft): Observable<DeliveryPlatformEntry> {
    return this.httpClient.put<DeliveryPlatformEntry>(
      `${this.platformsUrl}/${id}`,
      toDeliveryPlatformFormData(draft),
    );
  }

  setPlatformStatus(id: string, status: DeliveryPlatformStatus): Observable<DeliveryPlatformEntry> {
    return this.httpClient.patch<DeliveryPlatformEntry>(`${this.platformsUrl}/${id}/status`, {
      status,
    });
  }

  deletePlatform(id: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.platformsUrl}/${id}`);
  }

  getLinkedStores(id: string): Observable<readonly LinkedStore[]> {
    return this.httpClient.get<readonly LinkedStore[]>(`${this.platformsUrl}/${id}/stores`);
  }
}
