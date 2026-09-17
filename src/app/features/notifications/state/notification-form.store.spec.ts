import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { NotificationRepository } from '../data/notification.repository';
import {
  buildNotification,
  buildNotificationDetail,
  buildNotificationDraft,
} from '../testing/notification-fixture';
import { NotificationFormStore } from './notification-form.store';

const OPTIONS = {
  governorates: [{ id: 'governorate-1', name: 'طرطوس', areas: [{ id: 'area-1', name: 'صافيتا' }] }],
};
const RECIPIENT = {
  id: 'recipient-1',
  name: 'سارة أحمد التميمي',
  phone: '0501234567',
  city: 'طرطوس',
};

function createStore(overrides: Partial<NotificationRepository> = {}) {
  const saves: string[] = [];
  const repository: Partial<NotificationRepository> = {
    getFormOptions: () => of(OPTIONS),
    getNotification: (id) => of(buildNotificationDetail({ id })),
    searchRecipients: (audience, search) => of(search === 'لا' ? [] : [RECIPIENT]),
    estimateAudience: () => of({ deviceCount: 16840, sharePercent: 68.5 }),
    createNotification: (draft) => {
      saves.push(`create ${draft.title}`);
      return of(buildNotification());
    },
    updateNotification: (id, draft) => {
      saves.push(`update ${id} ${draft.title}`);
      return of(buildNotification());
    },
    ...overrides,
  };
  TestBed.configureTestingModule({
    providers: [NotificationFormStore, { provide: NotificationRepository, useValue: repository }],
  });
  return { store: TestBed.inject(NotificationFormStore), saves };
}

describe('NotificationFormStore', () => {
  it('loads the options for a new notification, and the notification too when editing', () => {
    const { store } = createStore();

    store.load(null);
    expect(store.isReady()).toBe(true);
    expect(store.governorates()).toEqual(OPTIONS.governorates);
    expect(store.editedDetail()).toBeNull();

    store.load('n7');
    expect(store.editedDetail()?.id).toBe('n7');
  });

  it('keeps the load error and tries again on retry', () => {
    let calls = 0;
    const { store } = createStore({
      getFormOptions: () =>
        ++calls === 1 ? throwError(() => new Error('تعذر التحميل')) : of(OPTIONS),
    });

    store.load(null);
    expect(store.error()).toBe('تعذر التحميل');
    store.retry();
    expect(store.isReady()).toBe(true);
  });

  it('searches recipients and estimates the audience, clearing the estimate without a governorate', () => {
    const { store } = createStore();

    store.searchRecipients({ audience: 'users', search: '' });
    expect(store.recipients()).toEqual([RECIPIENT]);

    store.estimateAudience({ audience: 'users', governorateId: 'governorate-1', areaId: null });
    expect(store.estimate()).toEqual({ deviceCount: 16840, sharePercent: 68.5 });
    store.estimateAudience(null);
    expect(store.estimate()).toBeNull();
  });

  it('creates or updates, and keeps why a save failed', async () => {
    const { store, saves } = createStore();

    expect(await store.save(null, buildNotificationDraft({ title: 'جديد' }))).toBe(true);
    expect(await store.save('n1', buildNotificationDraft({ title: 'معدل' }))).toBe(true);
    expect(saves).toEqual(['create جديد', 'update n1 معدل']);

    TestBed.resetTestingModule();
    const failing = createStore({
      createNotification: () => throwError(() => new Error('تعذر الحفظ')),
    });
    expect(await failing.store.save(null, buildNotificationDraft())).toBe(false);
    expect(failing.store.saveError()).toBe('تعذر الحفظ');
  });
});
