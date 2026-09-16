/** The four allowances the dialog edits, with the tag colour the design gives each kind. */
export interface PlanLimitField {
  readonly key: 'adsPerMonth' | 'activeOffers' | 'galleryImages' | 'videos';
  readonly label: string;
  readonly tag: string;
  readonly tagClasses: string;
}

export const PLAN_LIMIT_FIELDS: readonly PlanLimitField[] = [
  {
    key: 'adsPerMonth',
    label: 'عدد الحملات الإعلانية',
    tag: 'إعلان',
    tagClasses: 'bg-primary/16 text-primary',
  },
  {
    key: 'activeOffers',
    label: 'العروض والخصومات',
    tag: 'عرض نشط',
    tagClasses: 'bg-accent/16 text-accent',
  },
  {
    key: 'galleryImages',
    label: 'صور المعرض',
    tag: 'صورة',
    tagClasses: 'bg-[#7e22ce]/16 text-[#7e22ce]',
  },
  {
    key: 'videos',
    label: 'الفيديوهات',
    tag: 'فيديو',
    tagClasses: 'bg-[#ce2253]/16 text-[#ce2253]',
  },
];
