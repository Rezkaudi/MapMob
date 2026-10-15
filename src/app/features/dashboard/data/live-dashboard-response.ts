import { LiveReference } from '../../../core/http/live-reference';
import { ActionItem } from '../models/action-item';
import { PlaceStatus } from '../models/recent-place';

export interface LiveDashboardSummary {
  readonly revenue: { readonly amount: number; readonly currency: string };
  readonly pendingPlaceCount: number;
  readonly placeCount: number;
  readonly newPlaceCount: number;
  readonly userCount: number;
  readonly newUserCount: number;
}

export interface LiveRecentPlace {
  readonly id: string;
  readonly name: string;
  readonly logoUrl: string | null;
  readonly category: LiveReference | null;
  readonly governorate: LiveReference | null;
  readonly rating: number;
  readonly status: PlaceStatus;
  readonly createdAt: string;
}

export type LiveActionItem = ActionItem;
