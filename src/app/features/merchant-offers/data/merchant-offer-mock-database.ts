import { toCalendarDay } from '../../../shared/formatting/calendar-day';
import { CampaignStatus } from '../../../shared/models/campaign-status';
import { OfferDraftFields } from '../../../shared/models/offer-draft-fields';
import { OfferItem } from '../../../shared/models/offer-item';
import { resolveRunningStatus } from '../../../shared/state/campaign-running-status';
import { buildMerchantProductSeed } from '../../merchant-products/data/merchant-product-mock-seed';
import { MerchantOffer } from '../models/merchant-offer';
import { MerchantOfferCatalog } from '../models/merchant-offer-catalog';
import { countLiveOffers } from '../state/offer-quota';
import { buildMerchantOfferSeed } from './merchant-offer-mock-seed';
import { MerchantOfferRecord } from './merchant-offer-record';

const PLAN = { id: 'plan-free', name: 'الباقة المجانية' };
const ACTIVE_OFFER_LIMIT = 5;
const LIMIT_REACHED_MESSAGE = 'وصلت للحد المتاح من العروض النشطة في باقتك الحالية.';
const NOT_FOUND_MESSAGE = 'العرض غير موجود.';
const LIVE_STATUSES: ReadonlySet<CampaignStatus> = new Set(['active', 'scheduled']);

/** The in-memory offers behind the mock repository, loaded on first use. */
export class MerchantOfferMockDatabase {
  private records: readonly MerchantOfferRecord[];
  private readonly items: readonly OfferItem[];
  private nextIdNumber = 1;

  constructor(private readonly now: () => Date) {
    this.records = buildMerchantOfferSeed(now());
    this.items = buildMerchantProductSeed(now()).items.map(({ id, name, price, currency }) => ({
      id,
      name,
      price,
      currency,
    }));
  }

  readCatalog(): MerchantOfferCatalog {
    return {
      plan: PLAN,
      activeOfferLimit: ACTIVE_OFFER_LIMIT,
      items: this.records.map((record) => this.toOffer(record)),
    };
  }

  readOffer(id: string): MerchantOffer {
    return this.toOffer(this.find(id));
  }

  readItems(): readonly OfferItem[] {
    return this.items;
  }

  create(draft: OfferDraftFields): MerchantOffer {
    const record = this.toRecord(`new-offer-${this.nextIdNumber++}`, draft, null);
    this.refuseOverLimit(record, this.records);
    this.records = [...this.records, record];
    return this.toOffer(record);
  }

  update(id: string, draft: OfferDraftFields): MerchantOffer {
    const saved = this.find(id);
    const record = this.toRecord(id, draft, saved);
    this.refuseOverLimit(record, this.without(id));
    this.replace(record);
    return this.toOffer(record);
  }

  setPaused(id: string, isPaused: boolean): MerchantOffer {
    const record = { ...this.find(id), isPaused };
    this.refuseOverLimit(record, this.without(id));
    this.replace(record);
    return this.toOffer(record);
  }

  remove(id: string): void {
    this.records = this.without(id);
  }

  private refuseOverLimit(
    record: MerchantOfferRecord,
    others: readonly MerchantOfferRecord[],
  ): void {
    const isLive = LIVE_STATUSES.has(this.statusOf(record));
    const liveCount = countLiveOffers(others.map((other) => this.toOffer(other)));
    if (isLive && liveCount >= ACTIVE_OFFER_LIMIT) {
      throw new Error(LIMIT_REACHED_MESSAGE);
    }
  }

  private find(id: string): MerchantOfferRecord {
    const record = this.records.find((candidate) => candidate.id === id);
    if (!record) {
      throw new Error(NOT_FOUND_MESSAGE);
    }
    return record;
  }

  private without(id: string): readonly MerchantOfferRecord[] {
    return this.records.filter((record) => record.id !== id);
  }

  private replace(record: MerchantOfferRecord): void {
    this.records = this.records.map((candidate) =>
      candidate.id === record.id ? record : candidate,
    );
  }

  private toRecord(
    id: string,
    draft: OfferDraftFields,
    saved: MerchantOfferRecord | null,
  ): MerchantOfferRecord {
    const keptImageUrl = draft.isImageRemoved ? null : (saved?.imageUrl ?? null);
    return {
      id,
      title: draft.title,
      description: draft.description || null,
      discountPercent: draft.discountPercent,
      scope: draft.scope,
      itemIds: draft.scope === 'selectedItems' ? draft.itemIds : [],
      startsOn: draft.startsOn,
      endsOn: draft.endsOn,
      isPaused: draft.status === 'paused',
      isDraft: draft.status === 'draft',
      imageUrl: draft.image ? URL.createObjectURL(draft.image) : keptImageUrl,
      createdAt: saved?.createdAt ?? this.now().toISOString(),
    };
  }

  private statusOf(record: MerchantOfferRecord): CampaignStatus {
    if (record.isDraft) {
      return 'draft';
    }
    if (record.isPaused) {
      return 'paused';
    }
    return resolveRunningStatus(record, toCalendarDay(this.now()));
  }

  private toOffer(record: MerchantOfferRecord): MerchantOffer {
    const { isPaused, isDraft, ...offer } = record;
    return { ...offer, status: this.statusOf(record) };
  }
}
