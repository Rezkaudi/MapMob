import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, forkJoin, map } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { LiveEnvelope } from '../../../core/http/live-envelope';
import { LiveOwnerQuotaSummary } from '../../../shared/data/live-owner-quota-summary';
import { ownerPlanOf } from '../../../shared/data/owner-plan-of';
import { readAllOwnerPages } from '../../../shared/data/read-all-owner-pages';
import { MediaDraft } from '../models/media-draft';
import { MerchantMediaItem } from '../models/merchant-media-item';
import { MerchantMediaLibrary } from '../models/merchant-media-library';
import { LiveOwnerMedia } from './live-owner-media';
import { toMediaReplaceFormData, toNewMediaFormData } from './merchant-media-form-data';
import { MerchantMediaRepository } from './merchant-media.repository';
import { toMerchantMediaItem } from './to-merchant-media-item';

@Injectable()
export class MerchantMediaHttpRepository implements MerchantMediaRepository {
  private readonly httpClient = inject(HttpClient);
  private readonly mediaUrl = `${inject(API_BASE_URL)}/owner/media`;

  // The live plans cap pictures and videos together, so only the total limit is set.
  getLibrary(): Observable<MerchantMediaLibrary> {
    return forkJoin({
      summary: this.httpClient
        .get<LiveEnvelope<LiveOwnerQuotaSummary>>(`${this.mediaUrl}/summary`)
        .pipe(map(({ data }) => data)),
      media: readAllOwnerPages<LiveOwnerMedia>(this.httpClient, this.mediaUrl),
    }).pipe(
      map(({ summary, media }) => ({
        plan: ownerPlanOf(summary),
        imageLimit: null,
        videoLimit: null,
        totalLimit: summary.quota.limit,
        items: media.map(toMerchantMediaItem),
      })),
    );
  }

  addMedia(draft: MediaDraft): Observable<MerchantMediaItem> {
    return this.saveMedia(this.mediaUrl, toNewMediaFormData(draft));
  }

  replaceMedia(id: string, file: File): Observable<MerchantMediaItem> {
    return this.saveMedia(`${this.mediaUrl}/${id}`, toMediaReplaceFormData(file));
  }

  deleteMedia(id: string): Observable<void> {
    return this.httpClient.delete<unknown>(`${this.mediaUrl}/${id}`).pipe(map(() => undefined));
  }

  private saveMedia(url: string, body: FormData): Observable<MerchantMediaItem> {
    return this.httpClient
      .post<LiveEnvelope<LiveOwnerMedia>>(url, body)
      .pipe(map(({ data }) => toMerchantMediaItem(data)));
  }
}
