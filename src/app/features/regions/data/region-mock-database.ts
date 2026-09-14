import { Area } from '../models/area';
import { Governorate } from '../models/governorate';
import { RegionDraft } from '../models/region-draft';
import { GovernorateRecord, RegionMockSeed } from './region-mock-seed';

const NEW_AREA_NEIGHBOURHOOD_COUNT = 0;
const NEW_AREA_PLACE_COUNT = 0;

/**
 * One in-memory store behind both mock repositories, so a new area shows up in its
 * governorate's counts and deleting a governorate takes its areas with it.
 */
export class RegionMockDatabase {
  private governorates: GovernorateRecord[];
  private areas: Area[];

  constructor(seed: RegionMockSeed) {
    this.governorates = [...seed.governorates];
    this.areas = [...seed.areas];
  }

  listGovernorates(): Governorate[] {
    return this.governorates.map((record) => this.withCounts(record));
  }

  findGovernorate(id: string): Governorate | undefined {
    const record = this.governorates.find((candidate) => candidate.id === id);
    return record && this.withCounts(record);
  }

  addGovernorate(draft: RegionDraft): Governorate {
    const record: GovernorateRecord = { id: createId('governorate'), ...draft, updatedAt: now() };
    this.governorates = [record, ...this.governorates];
    return this.withCounts(record);
  }

  updateGovernorate(id: string, patch: Partial<RegionDraft>): Governorate {
    const record = { ...findOrThrow(this.governorates, id), ...patch, updatedAt: now() };
    this.governorates = replaceById(this.governorates, record);
    return this.withCounts(record);
  }

  removeGovernorate(id: string): void {
    this.governorates = this.governorates.filter((record) => record.id !== id);
    this.areas = this.areas.filter((area) => area.governorateId !== id);
  }

  listAreas(governorateId: string): Area[] {
    return this.areas.filter((area) => area.governorateId === governorateId);
  }

  addArea(governorateId: string, draft: RegionDraft): Area {
    const area: Area = {
      id: createId('area'),
      governorateId,
      ...draft,
      subAreaCount: NEW_AREA_NEIGHBOURHOOD_COUNT,
      placeCount: NEW_AREA_PLACE_COUNT,
      updatedAt: now(),
    };
    this.areas = [area, ...this.areas];
    return area;
  }

  updateArea(id: string, patch: Partial<RegionDraft>): Area {
    const area = { ...findOrThrow(this.areas, id), ...patch, updatedAt: now() };
    this.areas = replaceById(this.areas, area);
    return area;
  }

  removeArea(id: string): void {
    this.areas = this.areas.filter((area) => area.id !== id);
  }

  private withCounts(record: GovernorateRecord): Governorate {
    const areas = this.listAreas(record.id);
    return {
      ...record,
      subAreaCount: areas.length,
      placeCount: areas.reduce((total, area) => total + area.placeCount, 0),
    };
  }
}

function findOrThrow<T extends { readonly id: string }>(items: readonly T[], id: string): T {
  const item = items.find((candidate) => candidate.id === id);
  if (!item) {
    throw new Error(`لم يتم العثور على العنصر ${id}`);
  }
  return item;
}

function replaceById<T extends { readonly id: string }>(items: readonly T[], next: T): T[] {
  return items.map((item) => (item.id === next.id ? next : item));
}

function createId(prefix: string): string {
  return `${prefix}-${crypto.randomUUID()}`;
}

function now(): string {
  return new Date().toISOString();
}
