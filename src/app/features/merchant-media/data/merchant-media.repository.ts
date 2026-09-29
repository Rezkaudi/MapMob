import { Observable } from 'rxjs';
import { MediaDraft } from '../models/media-draft';
import { MerchantMediaItem } from '../models/merchant-media-item';
import { MerchantMediaLibrary } from '../models/merchant-media-library';

export abstract class MerchantMediaRepository {
  abstract getLibrary(): Observable<MerchantMediaLibrary>;
  abstract addMedia(draft: MediaDraft): Observable<MerchantMediaItem>;
  abstract replaceMedia(id: string, file: File): Observable<MerchantMediaItem>;
  abstract deleteMedia(id: string): Observable<void>;
}
