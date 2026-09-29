import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { MediaDraft } from '../models/media-draft';
import { MerchantMediaItem } from '../models/merchant-media-item';
import { MerchantMediaLibrary } from '../models/merchant-media-library';
import { toMediaReplaceFormData, toNewMediaFormData } from './merchant-media-form-data';
import { MerchantMediaRepository } from './merchant-media.repository';

@Injectable()
export class MerchantMediaHttpRepository implements MerchantMediaRepository {
  private readonly httpClient = inject(HttpClient);
  private readonly mediaUrl = `${inject(API_BASE_URL)}/owner/media`;

  getLibrary(): Observable<MerchantMediaLibrary> {
    return this.httpClient.get<MerchantMediaLibrary>(this.mediaUrl);
  }

  addMedia(draft: MediaDraft): Observable<MerchantMediaItem> {
    return this.httpClient.post<MerchantMediaItem>(this.mediaUrl, toNewMediaFormData(draft));
  }

  replaceMedia(id: string, file: File): Observable<MerchantMediaItem> {
    return this.httpClient.put<MerchantMediaItem>(
      `${this.mediaUrl}/${id}`,
      toMediaReplaceFormData(file),
    );
  }

  deleteMedia(id: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.mediaUrl}/${id}`);
  }
}
