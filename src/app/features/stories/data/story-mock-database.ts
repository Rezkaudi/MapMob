import { paginate } from '../../../../mock/paginate';
import { Clock } from '../../../core/config/clock';
import { StoryStatus } from '../../../shared/models/story-status';
import { StoryEntry } from '../models/story-entry';
import { StoryExportRequest } from '../models/story-export-request';
import { StoryPage } from '../models/story-page';
import { StoryQuery } from '../models/story-query';
import { StorySummary } from '../models/story-summary';
import { buildStoriesCsvFile } from './stories-csv';
import { SeedStory } from './story-mock-seed';

const NOT_FOUND_MESSAGE = 'لم تعد هذه القصة موجودة.';
const EXPIRED_MESSAGE = 'انتهت هذه القصة ولا يمكن تغيير ظهورها.';

/** The in-memory stories behind the mock repository, loaded on first use. */
export class StoryMockDatabase {
  private stories: readonly SeedStory[];

  constructor(
    seed: readonly SeedStory[],
    private readonly now: Clock,
  ) {
    this.stories = seed;
  }

  page(query: StoryQuery): StoryPage {
    return paginate(this.matching(query), query.pageIndex, query.pageSize);
  }

  summary(): StorySummary {
    const entries = this.newestFirst();
    const countOf = (status: StoryStatus) =>
      entries.filter((story) => story.status === status).length;
    return {
      storyCount: entries.length,
      activeCount: countOf('active'),
      hiddenCount: countOf('hidden'),
      expiredCount: countOf('expired'),
      viewCount: entries.reduce((total, story) => total + story.viewCount, 0),
    };
  }

  setHidden(id: string, isHidden: boolean): StoryEntry {
    const saved = this.findOrThrow(id);
    if (this.statusOf(saved) === 'expired') {
      throw new Error(EXPIRED_MESSAGE);
    }
    const next = { ...saved, isHidden };
    this.stories = this.stories.map((story) => (story.id === id ? next : story));
    return this.toEntry(next);
  }

  remove(id: string): void {
    this.findOrThrow(id);
    this.stories = this.stories.filter((story) => story.id !== id);
  }

  exported({ query, ids }: StoryExportRequest): readonly StoryEntry[] {
    if (ids.length === 0) {
      return this.matching(query);
    }
    return this.newestFirst().filter((story) => ids.includes(story.id));
  }

  exportedFile(request: StoryExportRequest): Blob {
    return buildStoriesCsvFile(this.exported(request));
  }

  private matching(query: StoryQuery): readonly StoryEntry[] {
    const search = query.search?.trim() ?? '';
    return this.newestFirst().filter(
      (story) =>
        story.place.name.includes(search) && (!query.status || story.status === query.status),
    );
  }

  private newestFirst(): readonly StoryEntry[] {
    return this.stories
      .map((story) => this.toEntry(story))
      .sort((left, right) => right.publishedAt.localeCompare(left.publishedAt));
  }

  private toEntry(seed: SeedStory): StoryEntry {
    const { isHidden: _isHidden, ...story } = seed;
    return { ...story, status: this.statusOf(seed) };
  }

  /** The clock wins: a story that ran out is expired, hidden or not. */
  private statusOf(story: SeedStory): StoryStatus {
    if (new Date(story.expiresAt).getTime() <= this.now().getTime()) {
      return 'expired';
    }
    return story.isHidden ? 'hidden' : 'active';
  }

  private findOrThrow(id: string): SeedStory {
    const found = this.stories.find((story) => story.id === id);
    if (!found) {
      throw new Error(NOT_FOUND_MESSAGE);
    }
    return found;
  }
}
