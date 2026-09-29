import { MediaDraft } from '../models/media-draft';
import { MerchantMediaItem } from '../models/merchant-media-item';
import { MerchantMediaLibrary } from '../models/merchant-media-library';
import { describeMediaRoom } from '../state/media-room';
import { buildMerchantMediaSeed } from './merchant-media-mock-seed';

const NO_IMAGE_ROOM_MESSAGE = 'وصلت للحد المتاح من الصور في باقتك الحالية.';
const NO_VIDEO_ROOM_MESSAGE = 'وصلت للحد المتاح من الفيديوهات في باقتك الحالية.';
const NOT_FOUND_MESSAGE = 'لم يعد هذا الملف موجوداً.';

/** The in-memory gallery behind the mock repository, loaded on first use. */
export class MerchantMediaMockDatabase {
  private library: MerchantMediaLibrary = buildMerchantMediaSeed();
  private nextIdNumber = 1;

  constructor(private readonly now: () => Date) {}

  readLibrary(): MerchantMediaLibrary {
    return this.library;
  }

  add(draft: MediaDraft): MerchantMediaItem {
    this.assertRoomFor(draft);
    const isMain = draft.kind === 'image' && draft.isMain;
    const item: MerchantMediaItem = {
      id: `new-media-${this.nextIdNumber++}`,
      kind: draft.kind,
      ...this.describeFile(draft.file),
      isMain,
      createdAt: this.now().toISOString(),
    };
    const kept = isMain
      ? this.library.items.map((existing) => ({ ...existing, isMain: false }))
      : this.library.items;
    this.library = { ...this.library, items: [...kept, item] };
    return item;
  }

  replace(id: string, file: File): MerchantMediaItem {
    const found = this.library.items.find((item) => item.id === id);
    if (!found) {
      throw new Error(NOT_FOUND_MESSAGE);
    }
    const replaced = { ...found, ...this.describeFile(file) };
    this.library = {
      ...this.library,
      items: this.library.items.map((item) => (item.id === id ? replaced : item)),
    };
    return replaced;
  }

  remove(id: string): void {
    this.library = { ...this.library, items: this.library.items.filter((item) => item.id !== id) };
  }

  private assertRoomFor(draft: MediaDraft): void {
    const room = describeMediaRoom(this.library);
    if (draft.kind === 'image' && !room.canAddImage) {
      throw new Error(NO_IMAGE_ROOM_MESSAGE);
    }
    if (draft.kind === 'video' && !room.canAddVideo) {
      throw new Error(NO_VIDEO_ROOM_MESSAGE);
    }
  }

  /** A mock has no server to cut a poster, so a new video shows its own first frame. */
  private describeFile(file: File) {
    return {
      url: URL.createObjectURL(file),
      posterUrl: null,
      mimeType: file.type,
      sizeBytes: file.size,
    };
  }
}
