import { CountWords } from '../../../shared/formatting/arabic-count';
import { PlanUsage } from '../models/plan-usage';

/** How one card names its kind. */
export interface UsageKindCopy {
  readonly title: string;
  readonly iconName: string;
  /** The words after "/ " — null writes the limit as "/ 10 مستخدمة". */
  readonly limitWords: CountWords | null;
  /** "متبقي …" needs the subject form: منتجان, not منتجين. */
  readonly remainingWords: CountWords;
  /** Closes the roomy note, e.g. " للرفع" in "متبقي 5 صور للرفع.". */
  readonly roomyNoteEnding: string;
}

export const USAGE_KIND_COPY: Record<keyof PlanUsage, UsageKindCopy> = {
  products: {
    title: 'المنتجات والخدمات',
    iconName: 'package',
    limitWords: null,
    remainingWords: { one: 'منتج واحد', two: 'منتجان', few: 'منتجات', many: 'منتجاً' },
    roomyNoteEnding: ' للإضافة',
  },
  galleryImages: {
    title: 'معرض الصور',
    iconName: 'media',
    limitWords: { one: 'صورة', two: 'صورتين', few: 'صور', many: 'صورة' },
    remainingWords: { one: 'صورة واحدة', two: 'صورتان', few: 'صور', many: 'صورة' },
    roomyNoteEnding: ' للرفع',
  },
  activeOffers: {
    title: 'العروض الترويجية',
    iconName: 'offers',
    limitWords: { one: 'عرض', two: 'عرضين', few: 'عروض', many: 'عرضاً' },
    remainingWords: {
      one: 'عرض نشط واحد',
      two: 'عرضان نشطان',
      few: 'عروض نشطة',
      many: 'عرضاً نشطاً',
    },
    roomyNoteEnding: '',
  },
  adsThisMonth: {
    title: 'الإعلانات',
    iconName: 'ads',
    limitWords: { one: 'إعلان', two: 'إعلانين', few: 'إعلانات', many: 'إعلاناً' },
    remainingWords: {
      one: 'إعلان نشط واحد',
      two: 'إعلانان نشطان',
      few: 'إعلانات نشطة',
      many: 'إعلاناً نشطاً',
    },
    roomyNoteEnding: '',
  },
};
