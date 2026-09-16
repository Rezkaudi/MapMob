import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { mockRequest } from '../../../../mock/mock-delay';
import { summarizeCampaigns } from '../../../../mock/summarize-campaigns';
import { CLOCK } from '../../../core/config/clock';
import { PagedResult } from '../../../core/models/paged-result';
import { toCalendarDay } from '../../../shared/formatting/calendar-day';
import { Offer } from '../models/offer';
import { OfferDetail } from '../models/offer-detail';
import { OfferDraft } from '../models/offer-draft';
import { OfferFormOptions } from '../models/offer-form-options';
import { OfferItem } from '../models/offer-item';
import { OfferPlace } from '../models/offer-place';
import { OfferQuery } from '../models/offer-query';
import { CampaignSummary } from '../../../shared/models/campaign-summary';
import { buildPlaceItems } from './offer-mock-items';
import { MOCK_PLACES } from '../../../../mock/mock-places';
import { OfferMockDatabase } from './offer-mock-database';
import { filterOffers, queryOffers } from './offer-mock-query';
import { OfferRepository } from './offer.repository';
import { buildOffersCsvFile } from './offers-csv';

@Injectable()
export class OfferMockRepository implements OfferRepository {
  private readonly database = inject(OfferMockDatabase);
  private readonly clock = inject(CLOCK);

  getOffers(query: OfferQuery): Observable<PagedResult<Offer>> {
    return mockRequest(() => queryOffers(this.database.listOffers(), query));
  }

  getSummary(): Observable<CampaignSummary> {
    return mockRequest(() => summarizeCampaigns(this.database.listOffers()));
  }

  getOfferDetail(id: string): Observable<OfferDetail> {
    return mockRequest(() => this.database.find(id));
  }

  pauseOffer(id: string): Observable<Offer> {
    return mockRequest(() => this.database.pause(id));
  }

  resumeOffer(id: string): Observable<Offer> {
    return mockRequest(() => this.database.resume(id, this.today()));
  }

  getFormOptions(): Observable<OfferFormOptions> {
    return mockRequest(() => ({
      places: MOCK_PLACES,
      categoryNames: [...new Set(MOCK_PLACES.map((place) => place.categoryName))],
    }));
  }

  getPlaceItems(placeId: string): Observable<readonly OfferItem[]> {
    return mockRequest(() => buildPlaceItems(findPlace(placeId).id));
  }

  createOffer(draft: OfferDraft): Observable<Offer> {
    return mockRequest(() => this.database.create(draft, findPlace(draft.placeId), this.today()));
  }

  updateOffer(id: string, draft: OfferDraft): Observable<Offer> {
    return mockRequest(() =>
      this.database.update(id, draft, findPlace(draft.placeId), this.today()),
    );
  }

  deleteOffer(id: string): Observable<void> {
    return mockRequest(() => this.database.remove(id));
  }

  exportOffers(query: OfferQuery): Observable<Blob> {
    return mockRequest(() => buildOffersCsvFile(filterOffers(this.database.listOffers(), query)));
  }

  private today(): string {
    return toCalendarDay(this.clock());
  }
}

function findPlace(placeId: string): OfferPlace {
  const place = MOCK_PLACES.find((candidate) => candidate.id === placeId);
  if (!place) {
    throw new Error(`لم يتم العثور على المتجر ${placeId}`);
  }
  return place;
}
