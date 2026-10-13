import { LiveReference } from '../../../core/http/live-reference';

export interface LivePlaceRow {
  readonly id: string;
  readonly code: string;
  readonly name: string;
  readonly publicUrl: string | null;
  readonly logoUrl: string | null;
  readonly category: LiveReference | null;
  readonly governorate: LiveReference | null;
  readonly rating: number;
  readonly status: string;
  readonly planTier: string | null;
  readonly createdAt: string;
}
