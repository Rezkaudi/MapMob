import { Clock } from '../../../core/config/clock';
import { ListQuery } from '../../../shared/models/list-query';
import { DeliveryPlatformDraft } from '../models/delivery-platform-draft';
import { DeliveryPlatformEntry } from '../models/delivery-platform-entry';
import { DeliveryPlatformPage } from '../models/delivery-platform-page';
import { DeliveryPlatformStatus } from '../models/delivery-platform-status';
import { DeliveryPlatformSummary } from '../models/delivery-platform-summary';
import { LinkedStore } from '../models/linked-store';
import { DeliveryPlatformMockSeed, SeedPlatform } from './delivery-platform-mock-seed';
import { queryDeliveryPlatforms } from './delivery-platform-mock-query';
import { summarizeDeliveryPlatforms } from './delivery-platform-mock-summary';

const DUPLICATE_NAME_MESSAGE = 'توجد منصة بهذا الاسم مسبقاً';
const NOT_FOUND_MESSAGE = 'لم تعد هذه المنصة موجودة.';

/** The in-memory platforms behind the mock repository, loaded on first use. */
export class DeliveryPlatformMockDatabase {
  private platforms: SeedPlatform[];
  private linkedStoresByPlatform: Map<string, readonly LinkedStore[]>;
  private nextIdNumber = 1;

  constructor(
    seed: DeliveryPlatformMockSeed,
    private readonly now: Clock,
  ) {
    this.platforms = [...seed.platforms];
    this.linkedStoresByPlatform = new Map(Object.entries(seed.linkedStores));
  }

  page(query: ListQuery): DeliveryPlatformPage {
    return queryDeliveryPlatforms(this.listWithCounts(), query);
  }

  summary(): DeliveryPlatformSummary {
    return summarizeDeliveryPlatforms(
      this.listWithCounts(),
      [...this.linkedStoresByPlatform.values()].flat(),
    );
  }

  add(draft: DeliveryPlatformDraft): DeliveryPlatformEntry {
    this.assertNameIsFree(draft.latinName, null);
    const platform: SeedPlatform = {
      id: `new-platform-${this.nextIdNumber++}`,
      ...this.describeDraft(draft, null),
      referralCount: 0,
      createdAt: this.now().toISOString(),
    };
    this.platforms = [...this.platforms, platform];
    this.linkedStoresByPlatform.set(platform.id, []);
    return this.withCount(platform);
  }

  update(id: string, draft: DeliveryPlatformDraft): DeliveryPlatformEntry {
    const saved = this.findOrThrow(id);
    this.assertNameIsFree(draft.latinName, id);
    return this.replace({ ...saved, ...this.describeDraft(draft, saved.logoUrl) });
  }

  setStatus(id: string, status: DeliveryPlatformStatus): DeliveryPlatformEntry {
    return this.replace({ ...this.findOrThrow(id), status });
  }

  remove(id: string): void {
    this.platforms = this.platforms.filter((platform) => platform.id !== id);
    this.linkedStoresByPlatform.delete(id);
  }

  linkedStores(id: string): readonly LinkedStore[] {
    this.findOrThrow(id);
    return this.linkedStoresByPlatform.get(id) ?? [];
  }

  private describeDraft(draft: DeliveryPlatformDraft, savedLogoUrl: string | null) {
    const { logoFile, logoUrl, ...fields } = draft;
    const keptLogoUrl = logoUrl === null ? null : savedLogoUrl;
    return { ...fields, logoUrl: logoFile ? URL.createObjectURL(logoFile) : keptLogoUrl };
  }

  private assertNameIsFree(latinName: string, ownId: string | null): void {
    const wanted = latinName.trim().toLowerCase();
    const isTaken = this.platforms.some(
      (platform) => platform.id !== ownId && platform.latinName.toLowerCase() === wanted,
    );
    if (isTaken) {
      throw new Error(DUPLICATE_NAME_MESSAGE);
    }
  }

  private listWithCounts(): DeliveryPlatformEntry[] {
    return this.platforms.map((platform) => this.withCount(platform));
  }

  private withCount(platform: SeedPlatform): DeliveryPlatformEntry {
    const linkedStoreCount = this.linkedStoresByPlatform.get(platform.id)?.length ?? 0;
    return { ...platform, linkedStoreCount };
  }

  private findOrThrow(id: string): SeedPlatform {
    const found = this.platforms.find((platform) => platform.id === id);
    if (!found) {
      throw new Error(NOT_FOUND_MESSAGE);
    }
    return found;
  }

  private replace(next: SeedPlatform): DeliveryPlatformEntry {
    this.platforms = this.platforms.map((platform) => (platform.id === next.id ? next : platform));
    return this.withCount(next);
  }
}
