import { CsvRow, buildCsvFile } from '../../../shared/files/csv-file';
import { StoryMediaKind } from '../../../shared/models/story-media-kind';
import { STORY_STATUS_LABELS } from '../../../shared/models/story-status';
import { StoryEntry } from '../models/story-entry';

const HEADER: CsvRow = [
  'اسم المتجر',
  'نص القصة',
  'النوع',
  'تاريخ النشر',
  'تاريخ الانتهاء',
  'المشاهدات',
  'الحالة',
];

const KIND_LABELS: Record<StoryMediaKind, string> = { image: 'صورة', video: 'فيديو' };

function toRow(story: StoryEntry): CsvRow {
  return [
    story.place.name,
    story.caption ?? '',
    KIND_LABELS[story.kind],
    story.publishedAt,
    story.expiresAt,
    String(story.viewCount),
    STORY_STATUS_LABELS[story.status],
  ];
}

export function buildStoriesCsvRows(stories: readonly StoryEntry[]): readonly CsvRow[] {
  return [HEADER, ...stories.map(toRow)];
}

export function buildStoriesCsvFile(stories: readonly StoryEntry[]): Blob {
  return buildCsvFile(buildStoriesCsvRows(stories));
}
