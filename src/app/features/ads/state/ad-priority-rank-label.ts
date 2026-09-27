import { AdPriority } from '../models/ad-priority';

/** The detail card writes the rank and its number, as "أعلى أولوية ( 5)" in the design. */
const RANK_NAME: Record<AdPriority, string> = {
  5: 'أعلى أولوية',
  4: 'أولوية عالية',
  3: 'أولوية متوسطة',
  2: 'أولوية منخفضة',
  1: 'أدنى أولوية',
};

export function adPriorityRankLabel(priority: AdPriority): string {
  return `${RANK_NAME[priority]} ( ${priority})`;
}
