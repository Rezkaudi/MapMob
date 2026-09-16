import { CampaignStatus } from '../../../shared/models/campaign-status';
import { resolveRunningStatus } from '../../../shared/state/campaign-running-status';
import { Ad } from '../models/ad';
import { AdDetail } from '../models/ad-detail';
import { AdDraft, AdSavedStatus } from '../models/ad-draft';

const KEPT_AS_SAVED: readonly AdSavedStatus[] = ['paused', 'draft'];

/** In-memory store behind the mock repository, so saves and deletes stick. */
export class AdMockDatabase {
  private details: AdDetail[];
  private nextNumber: number;

  constructor(seed: readonly AdDetail[]) {
    this.details = [...seed];
    this.nextNumber = seed.length + 1;
  }

  listAds(): readonly Ad[] {
    return this.details.map((detail) => detail.ad);
  }

  find(id: string): AdDetail {
    const detail = this.details.find((candidate) => candidate.ad.id === id);
    if (!detail) {
      throw new Error(`لم يتم العثور على الإعلان ${id}`);
    }
    return detail;
  }

  /** `placeName` is `null` for the app's own ad; `today` is `yyyy-mm-dd`. New ads lead the list. */
  create(draft: AdDraft, placeName: string | null, today: string): Ad {
    const detail = buildDetail(`ad-new-${this.nextNumber++}`, draft, placeName, today, null);
    this.details = [detail, ...this.details];
    return detail.ad;
  }

  update(id: string, draft: AdDraft, placeName: string | null, today: string): Ad {
    const keptMediaUrl = draft.isMediaRemoved ? null : this.find(id).mediaUrl;
    const detail = buildDetail(id, draft, placeName, today, keptMediaUrl);
    this.details = this.details.map((current) => (current.ad.id === id ? detail : current));
    return detail.ad;
  }

  remove(id: string): void {
    this.details = this.details.filter((detail) => detail.ad.id !== id);
  }
}

function resolveSavedStatus(draft: AdDraft, today: string): CampaignStatus {
  return KEPT_AS_SAVED.includes(draft.status) ? draft.status : resolveRunningStatus(draft, today);
}

function buildDetail(
  id: string,
  draft: AdDraft,
  placeName: string | null,
  today: string,
  keptMediaUrl: string | null,
): AdDetail {
  const isStoreAd = draft.advertiserType === 'place';
  return {
    ad: {
      id,
      title: draft.title,
      advertiserType: draft.advertiserType,
      placeName: isStoreAd ? placeName : null,
      contentType: draft.contentType,
      placement: draft.placement,
      priority: draft.priority,
      startsOn: draft.startsOn,
      endsOn: draft.endsOn,
      status: resolveSavedStatus(draft, today),
    },
    placeId: isStoreAd ? draft.placeId : null,
    position: draft.position,
    text: draft.text,
    // The mock has nowhere to upload to, so new media shows only for this session.
    mediaUrl: draft.media ? URL.createObjectURL(draft.media) : keptMediaUrl,
  };
}
