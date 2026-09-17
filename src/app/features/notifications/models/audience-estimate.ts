import { NotificationAudience } from './notification-audience';

export interface AudienceEstimateQuery {
  readonly audience: NotificationAudience;
  readonly governorateId: string;
  /** `null` counts the whole governorate. */
  readonly areaId: string | null;
}

/** "الجمهور المقدر: 16,840 جهاز نشط — يمثل حوالي 68.5% من إجمالي قاعدة المشتركين". */
export interface AudienceEstimate {
  readonly deviceCount: number;
  readonly sharePercent: number;
}
