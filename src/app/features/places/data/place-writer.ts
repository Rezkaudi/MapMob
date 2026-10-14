import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, concat, last, map, of, switchMap, throwError } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { CLOCK } from '../../../core/config/clock';
import { LiveEnvelope } from '../../../core/http/live-envelope';
import { LivePlan } from '../../../shared/data/live-plan';
import { addCalendarDays, toCalendarDay } from '../../../shared/formatting/calendar-day';
import { PlaceFormChoices } from '../models/place-form-choices';
import { PlacePackage } from '../models/place-package';
import { PlaceSaveRequest } from '../models/place-save-request';
import { resolvePlaceIds } from './live-place-choices';
import { toLivePlanSlug } from './live-place-mapping';
import { toLiveStoreForm } from './live-store-form';
import { PlacePartsWriter } from './place-parts-writer';

const MISSING_CATEGORY_MESSAGE = 'اختر تصنيفاً من القائمة قبل الحفظ.';

/**
 * Sending everything in one store call makes the server fail, so the store is saved with its
 * own fields first and every list goes to its own route after it.
 */
@Injectable({ providedIn: 'root' })
export class PlaceWriter {
  private readonly httpClient = inject(HttpClient);
  private readonly clock = inject(CLOCK);
  private readonly parts = inject(PlacePartsWriter);
  private readonly adminUrl = `${inject(API_BASE_URL)}/admin`;

  save(
    id: string | null,
    request: PlaceSaveRequest,
    choices: PlaceFormChoices,
    plans: readonly LivePlan[],
  ): Observable<string> {
    const ids = resolvePlaceIds(choices, request.value);
    const categoryId = ids.mainCategoryId;
    if (!categoryId) {
      return throwError(() => new Error(MISSING_CATEGORY_MESSAGE));
    }
    const isNew = id === null;
    const storeUrl = isNew ? `${this.adminUrl}/stores` : `${this.adminUrl}/stores/${id}`;
    const storeForm = toLiveStoreForm(request.value, ids, isNew ? 'create' : 'update');
    return this.httpClient.post<LiveEnvelope<{ id: string | number }>>(storeUrl, storeForm).pipe(
      map(({ data }) => String(data.id)),
      switchMap((storeId) =>
        concat(
          this.parts.saveWeek(storeId, request.week, isNew),
          this.parts.saveMedia(
            storeId,
            [
              ...request.images.map((file) => ({ file, type: 'image' as const })),
              ...request.videos.map((file) => ({ file, type: 'video' as const })),
            ],
            isNew,
          ),
          this.parts.saveProducts(storeId, categoryId, request.products, isNew),
          this.parts.saveDeliveryLinks(storeId, request.value.deliveryLinks, isNew),
          this.savePlan(storeId, request.value.package, request.previousPackage, plans),
        ).pipe(
          last(),
          map(() => storeId),
        ),
      ),
    );
  }

  // There is no route to end a plan early, so moving back to free changes nothing here.
  private savePlan(
    storeId: string,
    placePackage: PlacePackage,
    previousPackage: PlacePackage | null,
    plans: readonly LivePlan[],
  ): Observable<void> {
    const slug = toLivePlanSlug(placePackage, plans);
    const plan = plans.find((candidate) => candidate.slug === slug);
    if (placePackage === previousPackage || placePackage === 'free' || !plan) {
      return of(undefined);
    }
    const today = toCalendarDay(this.clock());
    return this.httpClient
      .post(`${this.adminUrl}/subscriptions`, {
        store_id: storeId,
        plan_id: plan.id,
        starts_at: `${today} 00:00:00`,
        ends_at: `${addCalendarDays(today, plan.duration_days)} 23:59:59`,
        status: 'active',
        auto_renew: false,
      })
      .pipe(map(() => undefined));
  }
}
