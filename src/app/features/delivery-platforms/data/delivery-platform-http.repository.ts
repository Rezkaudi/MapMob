import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, forkJoin, map, of, switchMap } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { LiveEnvelope } from '../../../core/http/live-envelope';
import { LiveMetaPage, readAllMetaPages } from '../../../core/http/read-all-meta-pages';
import { LiveDeliveryPlatform } from '../../../shared/data/live-delivery-platform';
import { LiveStoreDeliveryLink } from '../../../shared/data/live-store-delivery-link';
import { ListQuery } from '../../../shared/models/list-query';
import { DeliveryPlatformDraft } from '../models/delivery-platform-draft';
import { DeliveryPlatformEntry } from '../models/delivery-platform-entry';
import { DeliveryPlatformPage } from '../models/delivery-platform-page';
import { DeliveryPlatformStatus } from '../models/delivery-platform-status';
import { DeliveryPlatformSummary } from '../models/delivery-platform-summary';
import { LinkedStore } from '../models/linked-store';
import { queryDeliveryPlatforms } from './delivery-platform-list-query';
import {
  toDeliveryPlatformEntry,
  toDeliveryPlatformSummary,
  toLinkedStore,
  toLiveDeliveryPlatformForm,
} from './live-delivery-platform-mapping';
import { LiveDeliveryPlatformSummary } from './live-delivery-platform-summary';
import { LiveLinkedStore } from './live-linked-store';
import { DeliveryPlatformRepository } from './delivery-platform.repository';

interface LiveLinkedStoreRow {
  readonly id: number | string;
}

/** The list ignores search and page size, so every page is read and queried here. */
@Injectable()
export class DeliveryPlatformHttpRepository implements DeliveryPlatformRepository {
  readonly keepsWebsiteUrl = false;
  private readonly httpClient = inject(HttpClient);
  private readonly adminUrl = `${inject(API_BASE_URL)}/admin`;
  private readonly platformsUrl = `${this.adminUrl}/deliveryplatforms`;

  getPlatforms(query: ListQuery): Observable<DeliveryPlatformPage> {
    return readAllMetaPages((page) =>
      this.httpClient.get<LiveMetaPage<LiveDeliveryPlatform>>(this.platformsUrl, {
        params: { page },
      }),
    ).pipe(map((rows) => queryDeliveryPlatforms(rows.map(toDeliveryPlatformEntry), query)));
  }

  getSummary(): Observable<DeliveryPlatformSummary> {
    return this.httpClient
      .get<LiveEnvelope<LiveDeliveryPlatformSummary>>(`${this.platformsUrl}/summary`)
      .pipe(map(({ data }) => toDeliveryPlatformSummary(data)));
  }

  createPlatform(draft: DeliveryPlatformDraft): Observable<DeliveryPlatformEntry> {
    return this.httpClient
      .post<LiveEnvelope<LiveDeliveryPlatform>>(
        this.platformsUrl,
        toLiveDeliveryPlatformForm(draft, null),
      )
      .pipe(map(({ data }) => toDeliveryPlatformEntry(data)));
  }

  updatePlatform(id: string, draft: DeliveryPlatformDraft): Observable<DeliveryPlatformEntry> {
    return this.readPlatform(id).pipe(
      switchMap((saved) =>
        this.httpClient.post<LiveEnvelope<LiveDeliveryPlatform>>(
          `${this.platformsUrl}/${id}`,
          toLiveDeliveryPlatformForm(draft, saved),
        ),
      ),
      map(({ data }) => toDeliveryPlatformEntry(data)),
    );
  }

  /** The server's status route flips the switch whatever it is sent, so it is called only on a change. */
  setPlatformStatus(id: string, status: DeliveryPlatformStatus): Observable<DeliveryPlatformEntry> {
    return this.readPlatform(id).pipe(
      switchMap((saved) =>
        saved.status === status
          ? of(saved)
          : this.httpClient
              .patch<LiveEnvelope<LiveDeliveryPlatform>>(`${this.platformsUrl}/${id}/status`, {})
              .pipe(map(({ data }) => toDeliveryPlatformEntry(data))),
      ),
    );
  }

  deletePlatform(id: string): Observable<void> {
    return this.httpClient.delete(`${this.platformsUrl}/${id}`).pipe(map(() => undefined));
  }

  /** The platform's list names the stores; each store's own page and links fill the row. */
  getLinkedStores(id: string): Observable<readonly LinkedStore[]> {
    return readAllMetaPages((page) =>
      this.httpClient.get<LiveMetaPage<LiveLinkedStoreRow>>(`${this.platformsUrl}/${id}/stores`, {
        params: { page },
      }),
    ).pipe(
      switchMap((rows) =>
        rows.length
          ? forkJoin(rows.map((row) => this.readLinkedStore(String(row.id), id)))
          : of([]),
      ),
      map((stores) => stores.filter((store) => store !== null)),
    );
  }

  private readPlatform(id: string): Observable<DeliveryPlatformEntry> {
    return this.httpClient
      .get<LiveEnvelope<LiveDeliveryPlatform>>(`${this.platformsUrl}/${id}`)
      .pipe(map(({ data }) => toDeliveryPlatformEntry(data)));
  }

  /** `null` when the store no longer links to the platform. */
  private readLinkedStore(storeId: string, platformId: string): Observable<LinkedStore | null> {
    const storeUrl = `${this.adminUrl}/stores/${storeId}`;
    return forkJoin({
      store: this.httpClient.get<LiveEnvelope<LiveLinkedStore>>(storeUrl),
      links: this.httpClient.get<LiveEnvelope<readonly LiveStoreDeliveryLink[]>>(
        `${storeUrl}/delivery-links`,
      ),
    }).pipe(
      map(({ store, links }) => {
        const link = links.data.find(
          (candidate) => String(candidate.deliveryPlatformId) === platformId,
        );
        return link ? toLinkedStore(store.data, link) : null;
      }),
    );
  }
}
