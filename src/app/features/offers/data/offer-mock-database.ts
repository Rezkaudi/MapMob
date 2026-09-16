import { Offer } from '../models/offer';
import { OfferDetail } from '../models/offer-detail';
import { OfferDraft, OfferSavedStatus } from '../models/offer-draft';
import { OfferPlace } from '../models/offer-place';
import { CampaignStatus } from '../../../shared/models/campaign-status';
import { resolveRunningStatus } from '../../../shared/state/campaign-running-status';

/** In-memory store behind the mock repository, so pauses and deletes stick. */
export class OfferMockDatabase {
  private details: OfferDetail[];

  private nextNumber: number;

  constructor(seed: readonly OfferDetail[]) {
    this.details = [...seed];
    this.nextNumber = seed.length + 1;
  }

  listOffers(): readonly Offer[] {
    return this.details.map((detail) => detail.offer);
  }

  find(id: string): OfferDetail {
    const detail = this.details.find((candidate) => candidate.offer.id === id);
    if (!detail) {
      throw new Error(`لم يتم العثور على العرض ${id}`);
    }
    return detail;
  }

  pause(id: string): Offer {
    return this.updateOffer(id, { status: 'paused' });
  }

  /** `today` is a calendar day, `yyyy-mm-dd`. */
  resume(id: string, today: string): Offer {
    return this.updateOffer(id, { status: resolveRunningStatus(this.find(id).offer, today) });
  }

  /** `today` is a calendar day, `yyyy-mm-dd`. New offers lead the list. */
  create(draft: OfferDraft, place: OfferPlace, today: string): Offer {
    const id = `offer-new-${this.nextNumber++}`;
    const detail = buildDetail(id, draft, place, today, null);
    this.details = [detail, ...this.details];
    return detail.offer;
  }

  update(id: string, draft: OfferDraft, place: OfferPlace, today: string): Offer {
    const keptImageUrl = draft.isImageRemoved ? null : this.find(id).imageUrl;
    const detail = buildDetail(id, draft, place, today, keptImageUrl);
    this.details = this.details.map((current) => (current.offer.id === id ? detail : current));
    return detail.offer;
  }

  remove(id: string): void {
    this.details = this.details.filter((detail) => detail.offer.id !== id);
  }

  private updateOffer(id: string, patch: Partial<Offer>): Offer {
    const current = this.find(id);
    const updated: OfferDetail = { ...current, offer: { ...current.offer, ...patch } };
    this.details = this.details.map((detail) => (detail.offer.id === id ? updated : detail));
    return updated.offer;
  }
}

function resolveSavedStatus(draft: OfferDraft, today: string): CampaignStatus {
  const keptAsSaved: readonly OfferSavedStatus[] = ['paused', 'draft'];
  return keptAsSaved.includes(draft.status) ? draft.status : resolveRunningStatus(draft, today);
}

function buildDetail(
  id: string,
  draft: OfferDraft,
  place: OfferPlace,
  today: string,
  keptImageUrl: string | null,
): OfferDetail {
  return {
    offer: {
      id,
      title: draft.title,
      placeName: place.name,
      categoryName: draft.categoryName,
      startsOn: draft.startsOn,
      endsOn: draft.endsOn,
      status: resolveSavedStatus(draft, today),
    },
    description: draft.description,
    place,
    discountPercent: draft.discountPercent,
    scope: draft.scope,
    itemIds: draft.scope === 'selectedItems' ? draft.itemIds : [],
    // The mock has nowhere to upload to, so a new picture shows only for this session.
    imageUrl: draft.image ? URL.createObjectURL(draft.image) : keptImageUrl,
  };
}
