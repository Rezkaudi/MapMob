import { LiveReference } from '../../../core/http/live-reference';

export interface LiveWorkingDay {
  readonly day: number;
  readonly isOpen: boolean;
  readonly openTime: string | null;
  readonly closeTime: string | null;
}

export interface LivePlaceSubscription {
  readonly plan: { readonly id: string; readonly name: string; readonly tier: string | null };
  readonly status: string;
  readonly startsOn: string | null;
  readonly endsOn: string | null;
}

export interface LivePlaceProduct {
  readonly id: string;
  readonly name: string;
  readonly price: number;
  readonly currency: string;
  readonly imageUrl: string | null;
  readonly isAvailable: boolean;
  readonly orderUrl: string | null;
}

export interface LivePlaceOffer {
  readonly id: string;
  readonly title: string;
  readonly description: string | null;
  readonly startsOn: string;
  readonly endsOn: string;
  readonly status: string;
  readonly imageUrl: string | null;
}

export interface LivePlaceVideo {
  readonly id: string;
  readonly url: string;
  readonly posterUrl?: string | null;
  readonly duration?: string | null;
}

type LiveText = string | null;

export interface LivePlaceDetail {
  readonly id: string;
  readonly code: string;
  readonly name: string;
  readonly publicUrl?: LiveText;
  readonly status: string;
  readonly description?: LiveText;
  readonly logoUrl?: LiveText;
  readonly mainCategory: LiveReference | null;
  readonly subCategory: LiveReference | null;
  readonly isOpenNow: boolean;
  readonly owner: {
    readonly name: LiveText;
    readonly phone: LiveText;
    readonly extraPhone: LiveText;
  } | null;
  readonly contact: Readonly<
    Record<
      'phone' | 'extraPhone' | 'website' | 'whatsapp' | 'facebook' | 'instagram' | 'telegram',
      LiveText
    >
  > | null;
  readonly location: {
    readonly governorate: LiveReference | null;
    readonly area: LiveReference | null;
    readonly address: LiveText;
    readonly latitude: number;
    readonly longitude: number;
  } | null;
  readonly workingHours: readonly LiveWorkingDay[];
  readonly subscription: LivePlaceSubscription | null;
  readonly images: readonly { readonly id: string; readonly url: string }[];
  readonly videos: readonly LivePlaceVideo[];
  readonly products: readonly LivePlaceProduct[];
  readonly offers: readonly LivePlaceOffer[];
  readonly createdAt: string;
  readonly updatedAt: string;
}
