import { buildExpiredStoryEntry, buildStoryEntry } from '../testing/story-fixture';
import { buildStoriesCsvRows } from './stories-csv';

describe('buildStoriesCsvRows', () => {
  it('heads the file with the columns of the table and the drawer', () => {
    expect(buildStoriesCsvRows([])).toEqual([
      ['اسم المتجر', 'نص القصة', 'النوع', 'تاريخ النشر', 'تاريخ الانتهاء', 'المشاهدات', 'الحالة'],
    ]);
  });

  it('writes one row a story, with moments left as the server sent them', () => {
    const story = buildStoryEntry();
    const video = buildExpiredStoryEntry({ kind: 'video', caption: null });

    const [, first, second] = buildStoriesCsvRows([story, video]);

    expect(first).toEqual([
      'صيدلية الشفاء',
      'وصول دفعة سيرومات فيتامين C الجديدة',
      'صورة',
      story.publishedAt,
      story.expiresAt,
      '842',
      'نشطة',
    ]);
    expect(second.slice(0, 3)).toEqual(['كافيه ورد', '', 'فيديو']);
    expect(second.at(-1)).toBe('منتهية');
  });
});
