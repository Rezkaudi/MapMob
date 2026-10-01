import { MerchantStory } from '../models/merchant-story';
import { MerchantStoryLibrary } from '../models/merchant-story-library';
import { StoryDraft } from '../models/story-draft';
import { countActiveStories } from '../state/story-quota';
import { storyKindOf } from '../state/story-upload-rules';
import { STORY_LIFETIME_HOURS, buildMerchantStoriesSeed } from './merchant-stories-mock-seed';

const HOUR_MS = 3_600_000;
const NO_ROOM_MESSAGE = 'وصلت للحد المتاح من القصص النشطة في باقتك الحالية.';
const NOT_FOUND_MESSAGE = 'لم تعد هذه القصة موجودة.';
const EXPIRED_MESSAGE = 'انتهت هذه القصة ولا يمكن تعديلها.';
const FILE_NEEDED_MESSAGE = 'اختر صورة أو فيديو للقصة.';

/** The in-memory stories behind the mock repository, loaded on first use. */
export class MerchantStoriesMockDatabase {
  private library: MerchantStoryLibrary;
  private nextIdNumber = 1;

  constructor(private readonly now: () => Date) {
    this.library = buildMerchantStoriesSeed(now());
  }

  /** A story runs out on its own, so each read checks the clock again. */
  readLibrary(): MerchantStoryLibrary {
    const nowText = this.now().toISOString();
    const items = this.library.items.map((story) =>
      story.status === 'active' && story.expiresAt <= nowText
        ? { ...story, status: 'expired' as const }
        : story,
    );
    this.library = { ...this.library, items };
    return this.library;
  }

  add(draft: StoryDraft): MerchantStory {
    if (!draft.file) {
      throw new Error(FILE_NEEDED_MESSAGE);
    }
    const library = this.readLibrary();
    const limit = library.activeStoryLimit;
    if (limit !== null && countActiveStories(library) >= limit) {
      throw new Error(NO_ROOM_MESSAGE);
    }
    const publishedAt = this.now();
    const story: MerchantStory = {
      id: `new-story-${this.nextIdNumber++}`,
      ...this.describeFile(draft.file),
      caption: draft.caption,
      status: 'active',
      publishedAt: publishedAt.toISOString(),
      expiresAt: new Date(publishedAt.getTime() + STORY_LIFETIME_HOURS * HOUR_MS).toISOString(),
      viewCount: 0,
    };
    this.library = { ...library, items: [story, ...library.items] };
    return story;
  }

  update(id: string, draft: StoryDraft): MerchantStory {
    const library = this.readLibrary();
    const found = library.items.find((story) => story.id === id);
    if (!found) {
      throw new Error(NOT_FOUND_MESSAGE);
    }
    if (found.status === 'expired') {
      throw new Error(EXPIRED_MESSAGE);
    }
    const saved: MerchantStory = {
      ...found,
      ...(draft.file ? this.describeFile(draft.file) : {}),
      caption: draft.caption,
    };
    this.library = {
      ...library,
      items: library.items.map((story) => (story.id === id ? saved : story)),
    };
    return saved;
  }

  remove(id: string): void {
    this.library = {
      ...this.library,
      items: this.library.items.filter((story) => story.id !== id),
    };
  }

  /** A mock has no server to cut a poster, so a new video shows its own first frame. */
  private describeFile(file: File) {
    return { kind: storyKindOf(file), url: URL.createObjectURL(file), posterUrl: null };
  }
}
