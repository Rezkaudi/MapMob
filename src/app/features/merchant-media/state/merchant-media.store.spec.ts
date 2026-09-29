import { TestBed } from '@angular/core/testing';
import { Observable, of, throwError } from 'rxjs';
import { MerchantMediaRepository } from '../data/merchant-media.repository';
import { MediaDraft } from '../models/media-draft';
import { MerchantMediaItem } from '../models/merchant-media-item';
import { MerchantMediaLibrary } from '../models/merchant-media-library';
import {
  buildMediaItem,
  buildMediaLibrary,
  buildMediaVideo,
} from '../testing/merchant-media-fixture';
import { MerchantMediaStore } from './merchant-media.store';

const MAIN = buildMediaItem({ id: 'main', isMain: true });
const PICTURE = buildMediaItem({ id: 'picture' });
const VIDEO = buildMediaVideo({ id: 'video' });
const NEW_PICTURE = new File(['x'], 'front.jpg', { type: 'image/jpeg' });
const TEXT_FILE = new File(['x'], 'notes.txt', { type: 'text/plain' });

class FakeRepository extends MerchantMediaRepository {
  library: MerchantMediaLibrary = buildMediaLibrary({ items: [PICTURE, VIDEO, MAIN] });
  failure: Error | null = null;
  added: MediaDraft[] = [];
  replaced: [string, File][] = [];
  deleted: string[] = [];

  getLibrary(): Observable<MerchantMediaLibrary> {
    return this.answer(this.library);
  }
  addMedia(draft: MediaDraft): Observable<MerchantMediaItem> {
    this.added.push(draft);
    return this.answer(buildMediaItem({ id: 'new', isMain: draft.isMain }));
  }
  replaceMedia(id: string, file: File): Observable<MerchantMediaItem> {
    this.replaced.push([id, file]);
    return this.answer(buildMediaItem({ id, url: 'blob:replaced' }));
  }
  deleteMedia(id: string): Observable<void> {
    this.deleted.push(id);
    return this.answer(undefined);
  }
  private answer<T>(value: T): Observable<T> {
    return this.failure ? throwError(() => this.failure) : of(value);
  }
}

function setUp(configure: (repository: FakeRepository) => void = () => undefined) {
  const repository = new FakeRepository();
  configure(repository);
  TestBed.configureTestingModule({
    providers: [MerchantMediaStore, { provide: MerchantMediaRepository, useValue: repository }],
  });
  const store = TestBed.inject(MerchantMediaStore);
  store.load();
  return { store, repository };
}

const cardIds = (store: InstanceType<typeof MerchantMediaStore>) =>
  store.cards().map((card) => card.item.id);

describe('MerchantMediaStore', () => {
  it('loads the gallery with the main picture first, the tabs, tiles and quota', () => {
    const { store } = setUp();

    expect(cardIds(store)).toEqual(['main', 'picture', 'video']);
    expect(store.tabs().map((tab) => tab.count)).toEqual([3, 2, 1]);
    expect(store.countTiles().map((tile) => tile.count)).toEqual([2, 1]);
    expect(store.planName()).toBe('الباقة المجانية');
    expect(store.quota()?.limitText).toBe('/ 5 وسائط مستخدمة');
    expect(store.limitText()).toBe('الحد المسموح 5 وسائط');
    expect(store.hasNoMedia()).toBe(false);
  });

  it('keeps the load error for the page to show', () => {
    const { store } = setUp((repository) => (repository.failure = new Error('انقطع الاتصال')));

    expect(store.error()).toBe('انقطع الاتصال');
  });

  it('shows one kind per tab', () => {
    const { store } = setUp();

    store.selectTab('videos');

    expect(cardIds(store)).toEqual(['video']);
    expect(store.selectedTab()).toBe('videos');
  });

  it('says the gallery is empty only when the place has no media at all', () => {
    const { store } = setUp((fake) => (fake.library = { ...fake.library, items: [] }));

    expect(store.hasNoMedia()).toBe(true);
    expect(store.tabs().map((tab) => tab.count)).toEqual([0, 0, 0]);
  });

  it('opens the add dialog on the kind of the tab, or the kind that still has room', () => {
    const { store } = setUp();

    store.openAdd();
    expect(store.addDialog()).toEqual({
      startKind: 'image',
      canAddImage: true,
      canAddVideo: false,
      notice: 'متبقي لديك وسيطان ضمن الباقة المجانية (الحد المسموح 5 وسائط)',
    });

    store.closeDialog();
    store.selectTab('videos');
    store.openAdd();
    expect(store.addDialog()?.startKind).toBe('image');
  });

  it('does not open the add dialog when the plan is full', () => {
    const { store } = setUp((fake) => (fake.library = { ...fake.library, imageLimit: 2 }));

    expect(store.isFull()).toBe(true);
    store.openAdd();
    expect(store.addDialog()).toBeNull();
  });

  it('adds a main picture, clears the old flag and closes the dialog', async () => {
    const { store, repository } = setUp();
    store.openAdd();

    await store.submitDraft({ kind: 'image', file: NEW_PICTURE, isMain: true });

    expect(repository.added).toHaveLength(1);
    expect(store.addDialog()).toBeNull();
    expect(cardIds(store)).toEqual(['new', 'picture', 'video', 'main']);
    expect(
      store
        .cards()
        .filter((card) => card.item.isMain)
        .map((card) => card.item.id),
    ).toEqual(['new']);
  });

  it('keeps the dialog open with the error when adding fails', async () => {
    const { store, repository } = setUp();
    store.openAdd();
    repository.failure = new Error('الملف كبير');

    await store.submitDraft({ kind: 'image', file: NEW_PICTURE, isMain: false });

    expect(store.addDialog()).not.toBeNull();
    expect(store.saveError()).toBe('الملف كبير');
  });

  it('replaces the file of one card', async () => {
    const { store, repository } = setUp();

    await store.replaceFile(PICTURE, NEW_PICTURE);

    expect(repository.replaced).toEqual([['picture', NEW_PICTURE]]);
    expect(store.cards().find((card) => card.item.id === 'picture')?.item.url).toBe(
      'blob:replaced',
    );
  });

  it('refuses a replacement of the wrong type before sending it', async () => {
    const { store, repository } = setUp();

    await store.replaceFile(PICTURE, TEXT_FILE);

    expect(repository.replaced).toEqual([]);
    expect(store.saveError()).toBe('notes.txt: يُسمح بصيغ JPG و PNG فقط');
  });

  it('deletes a card after the question', async () => {
    const { store, repository } = setUp();

    store.openDelete(VIDEO);
    expect(store.deleteCopy()?.title).toBe('حذف الفيديو');
    await store.confirmDelete();

    expect(repository.deleted).toEqual(['video']);
    expect(store.deleteCopy()).toBeNull();
    expect(cardIds(store)).toEqual(['main', 'picture']);
  });
});
