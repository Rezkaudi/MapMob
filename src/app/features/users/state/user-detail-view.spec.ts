import { buildUserDetail } from '../testing/user-fixture';
import {
  buildActivityRows,
  buildDetailStatCards,
  buildFavoriteRows,
  buildReviewRows,
} from './user-detail-view';

const NOW = new Date('2024-01-14T00:00:00.000Z');
const DETAIL = buildUserDetail();

describe('user detail view', () => {
  it('builds the four activity stat cards in the design order', () => {
    expect(buildDetailStatCards(DETAIL.stats)).toEqual([
      { label: 'عمليات البحث', value: '139', icon: 'users' },
      { label: 'الأماكن التي تمت مشاهدتها', value: '26', icon: 'building' },
      { label: 'الأماكن المفضلة', value: '12', icon: 'heart-rounded' },
      { label: 'التقييمات المضافة', value: '17', icon: 'star-rounded' },
    ]);
  });

  it('gives each activity its coloured tile and a relative time', () => {
    expect(buildActivityRows(DETAIL.activities, NOW)).toEqual([
      {
        id: 'activity-1',
        description: 'بحث عن مطاعم وكافيهات في حي الروضة',
        timeLabel: 'منذ 10 دقائق',
        icon: 'search-rounded',
        tileClass: 'bg-primary',
      },
    ]);
  });

  it('gives each favourite place its category tile and a "category · city" line', () => {
    expect(buildFavoriteRows(DETAIL.favoritePlaces, NOW)).toEqual([
      {
        id: 'favorite-1',
        placeName: 'مطعم النخيل',
        metaLabel: 'مطاعم · طرطوس',
        savedLabel: 'منذ يومين',
        icon: 'utensils-crossed',
        tileClass: 'bg-[#ff8104]',
      },
    ]);
  });

  it('writes the review meta and date, and fills as many stars as the rating', () => {
    const [row] = buildReviewRows([{ ...DETAIL.reviews[0], rating: 3 }]);

    expect(row.metaLabel).toBe('تصنيف: مطاعم · حي النخيل، الرياض');
    expect(row.dateLabel).toBe('تاريخ التقييم: 02 سبتمبر 2026');
    expect(row.rating).toBe(3);
  });
});
