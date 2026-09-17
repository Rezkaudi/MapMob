import { REGION_MOCK_SEED } from '../../regions/data/region-mock-seed';
import { AudienceEstimate, AudienceEstimateQuery } from '../models/audience-estimate';
import { NotificationAudience } from '../models/notification-audience';
import { NotificationGovernorate } from '../models/notification-form-options';

/** Everyone the audience reaches; the design's 16,840 devices are 68.5% of the users. */
export const MOCK_AUDIENCE_TOTALS: Record<NotificationAudience, number> = {
  users: 24_580,
  companies: 1_860,
};

const FIRST_GOVERNORATE_SHARE = 0.685;
const OTHER_GOVERNORATES_SHARE = 0.3;
const PERCENT = 100;
const ONE_DECIMAL = 10;
const DEVICE_ROUNDING = 10;
/** An area's share is its governorate's share split across it and the areas after it. */
const AREA_SPLIT_OFFSET = 2;

export const NOTIFICATION_MOCK_GOVERNORATES: readonly NotificationGovernorate[] =
  REGION_MOCK_SEED.governorates.map((governorate) => ({
    id: governorate.id,
    name: governorate.name,
    areas: REGION_MOCK_SEED.areas
      .filter((area) => area.governorateId === governorate.id)
      .map((area) => ({ id: area.id, name: area.name })),
  }));

function governorateShare(governorateId: string): number {
  const index = NOTIFICATION_MOCK_GOVERNORATES.findIndex(
    (governorate) => governorate.id === governorateId,
  );
  return index <= 0 ? FIRST_GOVERNORATE_SHARE : OTHER_GOVERNORATES_SHARE / index;
}

function areaShare(query: AudienceEstimateQuery): number {
  const share = governorateShare(query.governorateId);
  if (!query.areaId) {
    return share;
  }
  const areas =
    NOTIFICATION_MOCK_GOVERNORATES.find((governorate) => governorate.id === query.governorateId)
      ?.areas ?? [];
  const areaIndex = Math.max(
    areas.findIndex((area) => area.id === query.areaId),
    0,
  );
  return share / (areaIndex + AREA_SPLIT_OFFSET);
}

export function estimateMockAudience(query: AudienceEstimateQuery): AudienceEstimate {
  const share = areaShare(query);
  const devices = MOCK_AUDIENCE_TOTALS[query.audience] * share;
  return {
    deviceCount: Math.round(devices / DEVICE_ROUNDING) * DEVICE_ROUNDING,
    sharePercent: Math.round(share * PERCENT * ONE_DECIMAL) / ONE_DECIMAL,
  };
}
