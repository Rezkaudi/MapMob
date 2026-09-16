/** 5 shows first. */
export type AdPriority = 1 | 2 | 3 | 4 | 5;

export const AD_PRIORITIES: readonly AdPriority[] = [5, 4, 3, 2, 1];

export const AD_PRIORITY_LABEL: Record<AdPriority, string> = {
  5: '5 — عالية جداً (أولوية قصوى في الظهور)',
  4: '4 — عالية',
  3: '3 — متوسطة',
  2: '2 — منخفضة',
  1: '1 — منخفضة جداً',
};
