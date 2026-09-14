import { Area } from '../models/area';
import { RegionEntry } from '../models/region-entry';

export type GovernorateRecord = Pick<RegionEntry, 'id' | 'name' | 'status' | 'updatedAt'>;

export interface RegionMockSeed {
  readonly governorates: readonly GovernorateRecord[];
  readonly areas: readonly Area[];
}

const SEED_DATE = '2024-01-12T00:00:00.000Z';
const NEIGHBOURHOODS_PER_AREA = 5;
const PLACES_PER_AREA = 300;
const SUSPENDED_GOVERNORATE = 'اللاذقية';

/** Tartus keeps the four areas the design draws; Quneitra has none, to show the empty page. */
const AREA_NAMES_BY_GOVERNORATE: Record<string, readonly string[]> = {
  طرطوس: ['طرطوس المدينة', 'الدريكيش', 'صافيتا', 'الشيخ سعد'],
  حمص: ['حمص المدينة', 'تلكلخ', 'الرستن', 'المخرم', 'القصير'],
  اللاذقية: ['اللاذقية المدينة', 'جبلة', 'القرداحة', 'الحفة', 'كسب'],
  دمشق: ['المزة', 'كفرسوسة', 'الميدان', 'القصاع', 'ركن الدين'],
  حلب: ['حلب المدينة', 'منبج', 'الباب', 'عفرين', 'السفيرة'],
  حماة: ['حماة المدينة', 'مصياف', 'السلمية'],
  درعا: ['درعا المدينة', 'إزرع', 'الصنمين'],
  السويداء: ['السويداء المدينة', 'شهبا', 'صلخد'],
  إدلب: ['إدلب المدينة', 'أريحا', 'معرة النعمان'],
  الحسكة: ['الحسكة المدينة', 'القامشلي', 'رأس العين'],
  'دير الزور': ['دير الزور المدينة', 'الميادين', 'البوكمال'],
  الرقة: ['الرقة المدينة', 'تل أبيض', 'الثورة'],
  'ريف دمشق': ['دوما', 'التل', 'القطيفة'],
  القنيطرة: [],
};

const governorates: GovernorateRecord[] = Object.keys(AREA_NAMES_BY_GOVERNORATE).map(
  (name, index) => ({
    id: `governorate-${index + 1}`,
    name,
    status: name === SUSPENDED_GOVERNORATE ? 'suspended' : 'active',
    updatedAt: SEED_DATE,
  }),
);

const areas: Area[] = governorates.flatMap((governorate) =>
  AREA_NAMES_BY_GOVERNORATE[governorate.name].map((name, index) => ({
    id: `${governorate.id}-area-${index + 1}`,
    governorateId: governorate.id,
    name,
    subAreaCount: NEIGHBOURHOODS_PER_AREA,
    placeCount: PLACES_PER_AREA,
    status: 'active' as const,
    updatedAt: SEED_DATE,
  })),
);

export const REGION_MOCK_SEED: RegionMockSeed = { governorates, areas };
