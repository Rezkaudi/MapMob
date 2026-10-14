import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, concat, last, map, of, switchMap } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { LiveEnvelope } from '../../../core/http/live-envelope';
import { MediaFile } from '../../../shared/ui/media-picker/media-file';
import { EditedPlaceProduct } from '../models/edited-place-product';
import { WorkingDay } from '../models/working-day';
import { PlaceFormValue } from '../state/place-form-group';
import {
  LiveMediaType,
  toLiveDeliveryLinkBody,
  toLiveMediaForm,
  toLiveProductForm,
  toLiveWorkingHourBody,
} from './live-place-parts';

interface LiveRow {
  readonly id: number | string;
}
interface LiveHourRow extends LiveRow {
  readonly day_of_week: number;
}
interface LiveMediaRow extends LiveRow {
  readonly type: string;
  readonly url: string;
}
interface LiveProductRow extends LiveRow {
  readonly store_id: number | string;
}
interface LiveLinkRow extends LiveRow {
  readonly platform: string;
}

type DeliveryLinkValue = PlaceFormValue['deliveryLinks'][number];

const ALL_ROWS_PAGE_SIZE = 1000;
const PUT_OVER_POST = { _method: 'PUT' };

/** Runs the calls one at a time, so the slow server is never asked many things at once. */
function inTurn(calls: readonly Observable<unknown>[]): Observable<void> {
  return concat(of(null), ...calls).pipe(
    last(),
    map(() => undefined),
  );
}

/** Saves the lists a place keeps on routes of their own; a new place has none to read first. */
@Injectable({ providedIn: 'root' })
export class PlacePartsWriter {
  private readonly httpClient = inject(HttpClient);
  private readonly adminUrl = `${inject(API_BASE_URL)}/admin`;

  saveWeek(storeId: string, week: readonly WorkingDay[], isNew: boolean): Observable<void> {
    const url = `${this.adminUrl}/stores/${storeId}/working-hours`;
    return this.readRows<LiveHourRow>(url, isNew).pipe(
      switchMap((rows) =>
        inTurn(
          week.map((day) => {
            const body = toLiveWorkingHourBody(day);
            const row = rows.find((candidate) => candidate.day_of_week === body.day_of_week);
            return row
              ? this.httpClient.post(`${url}/${row.id}`, { ...body, ...PUT_OVER_POST })
              : this.httpClient.post(url, body);
          }),
        ),
      ),
    );
  }

  saveMedia(
    storeId: string,
    pictures: readonly { readonly file: MediaFile; readonly type: LiveMediaType }[],
    isNew: boolean,
  ): Observable<void> {
    const url = `${this.adminUrl}/stores/${storeId}/media`;
    const keptUrls = new Set(
      pictures.filter(({ file }) => !file.file).map(({ file }) => file.previewUrl),
    );
    return this.readRows<LiveMediaRow>(url, isNew).pipe(
      switchMap((rows) =>
        inTurn([
          ...rows
            .filter((row) => !keptUrls.has(row.url))
            .map((row) => this.httpClient.delete(`${url}/${row.id}`)),
          ...pictures.flatMap(({ file, type }, index) =>
            file.file ? [this.httpClient.post(url, toLiveMediaForm(file.file, type, index))] : [],
          ),
        ]),
      ),
    );
  }

  saveProducts(
    storeId: string,
    categoryId: string,
    products: readonly EditedPlaceProduct[],
    isNew: boolean,
  ): Observable<void> {
    const url = `${this.adminUrl}/products`;
    const read = isNew
      ? of([])
      : this.httpClient
          .get<LiveEnvelope<readonly LiveProductRow[]>>(url, {
            params: { store_id: storeId, per_page: ALL_ROWS_PAGE_SIZE },
          })
          // Only this place's rows are touched, even if the filter were ever ignored.
          .pipe(map(({ data }) => data.filter((row) => String(row.store_id) === storeId)));
    return read.pipe(
      switchMap((rows) => {
        const savedIds = new Set(rows.map((row) => String(row.id)));
        const keptIds = new Set(products.map((product) => product.id));
        return inTurn([
          ...products.map((product) =>
            savedIds.has(product.id)
              ? this.httpClient.post(
                  `${url}/${product.id}`,
                  toLiveProductForm(product, storeId, categoryId, 'update'),
                )
              : this.httpClient.post(
                  url,
                  toLiveProductForm(product, storeId, categoryId, 'create'),
                ),
          ),
          ...[...savedIds]
            .filter((id) => !keptIds.has(id))
            .map((id) => this.httpClient.delete(`${url}/${id}`)),
        ]);
      }),
    );
  }

  saveDeliveryLinks(
    storeId: string,
    links: readonly DeliveryLinkValue[],
    isNew: boolean,
  ): Observable<void> {
    const url = `${this.adminUrl}/stores/${storeId}/delivery-links`;
    return this.readRows<LiveLinkRow>(url, isNew).pipe(
      switchMap((rows) =>
        inTurn(
          links.flatMap((link, index) => {
            const row = rows.find((candidate) => candidate.platform === link.platformId);
            if (!link.isEnabled || !link.storeUrl) {
              return row ? [this.httpClient.delete(`${url}/${row.id}`)] : [];
            }
            const body = toLiveDeliveryLinkBody(link.platformId, link.storeUrl, index + 1);
            return [
              row
                ? this.httpClient.post(`${url}/${row.id}`, { ...body, ...PUT_OVER_POST })
                : this.httpClient.post(url, body),
            ];
          }),
        ),
      ),
    );
  }

  private readRows<T>(url: string, isNew: boolean): Observable<readonly T[]> {
    if (isNew) {
      return of([]);
    }
    return this.httpClient.get<LiveEnvelope<readonly T[]>>(url).pipe(map(({ data }) => data));
  }
}
