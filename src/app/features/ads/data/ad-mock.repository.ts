import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { mockRequest } from '../../../../mock/mock-delay';
import { MOCK_PLACES } from '../../../../mock/mock-places';
import { summarizeCampaigns } from '../../../../mock/summarize-campaigns';
import { CLOCK } from '../../../core/config/clock';
import { PagedResult } from '../../../core/models/paged-result';
import { toCalendarDay } from '../../../shared/formatting/calendar-day';
import { CampaignSummary } from '../../../shared/models/campaign-summary';
import { Ad } from '../models/ad';
import { AdDetail } from '../models/ad-detail';
import { AdDraft } from '../models/ad-draft';
import { AdFormOptions } from '../models/ad-form-options';
import { AdQuery } from '../models/ad-query';
import { AdMockDatabase } from './ad-mock-database';
import { filterAds, queryAds } from './ad-mock-query';
import { AdRepository } from './ad.repository';
import { buildAdsCsvFile } from './ads-csv';

@Injectable()
export class AdMockRepository implements AdRepository {
  private readonly database = inject(AdMockDatabase);
  private readonly clock = inject(CLOCK);

  getAds(query: AdQuery): Observable<PagedResult<Ad>> {
    return mockRequest(() => queryAds(this.database.listAds(), query));
  }

  getSummary(): Observable<CampaignSummary> {
    return mockRequest(() => summarizeCampaigns(this.database.listAds()));
  }

  getAdDetail(id: string): Observable<AdDetail> {
    return mockRequest(() => this.database.find(id));
  }

  getFormOptions(): Observable<AdFormOptions> {
    return mockRequest(() => ({ places: MOCK_PLACES.map(({ id, name }) => ({ id, name })) }));
  }

  createAd(draft: AdDraft): Observable<Ad> {
    return mockRequest(() => this.database.create(draft, placeNameOf(draft), this.today()));
  }

  updateAd(id: string, draft: AdDraft): Observable<Ad> {
    return mockRequest(() => this.database.update(id, draft, placeNameOf(draft), this.today()));
  }

  deleteAd(id: string): Observable<void> {
    return mockRequest(() => this.database.remove(id));
  }

  exportAds(query: AdQuery): Observable<Blob> {
    return mockRequest(() => buildAdsCsvFile(filterAds(this.database.listAds(), query)));
  }

  private today(): string {
    return toCalendarDay(this.clock());
  }
}

function placeNameOf(draft: AdDraft): string | null {
  if (draft.advertiserType === 'admin') {
    return null;
  }
  const place = MOCK_PLACES.find((candidate) => candidate.id === draft.placeId);
  if (!place) {
    throw new Error(`لم يتم العثور على المتجر ${draft.placeId}`);
  }
  return place.name;
}
