import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { ComplaintRepository } from '../data/complaint.repository';
import { ComplaintReview } from '../models/complaint-review';
import { buildComplaintDetail } from '../testing/complaint-fixture';
import { ComplaintDetailStore } from './complaint-detail.store';

const DETAIL = buildComplaintDetail({ adminNotes: 'ملاحظة سابقة' });

function createStore(overrides: Partial<ComplaintRepository> = {}) {
  const savedReviews: ComplaintReview[] = [];
  const repository: Partial<ComplaintRepository> = {
    getComplaint: () => of(DETAIL),
    saveReview: (_id, review) => {
      savedReviews.push(review);
      return of({ ...DETAIL, ...review });
    },
    ...overrides,
  };
  TestBed.configureTestingModule({
    providers: [ComplaintDetailStore, { provide: ComplaintRepository, useValue: repository }],
  });
  return { store: TestBed.inject(ComplaintDetailStore), savedReviews };
}

describe('ComplaintDetailStore', () => {
  it('loads a complaint and starts the review from its saved status and notes', () => {
    const { store } = createStore();

    store.loadComplaint('complaint-1');

    expect(store.detail()).toEqual(DETAIL);
    expect(store.view()?.statusLabel).toBe('جديد');
    expect(store.draftStatus()).toBe('new');
    expect(store.draftNotes()).toBe('ملاحظة سابقة');
    expect(store.hasUnsavedChanges()).toBe(false);
  });

  it('reports a failed load', () => {
    const { store } = createStore({
      getComplaint: () => throwError(() => new Error('لم يتم العثور على البلاغ')),
    });

    store.loadComplaint('missing');

    expect(store.error()).toBe('لم يتم العثور على البلاغ');
    expect(store.detail()).toBeNull();
  });

  it('tracks the picked status and notes as unsaved changes', () => {
    const { store } = createStore();
    store.loadComplaint('complaint-1');

    store.changeStatus('resolved');
    store.changeNotes('تم تحديث العنوان');

    expect(store.draftStatus()).toBe('resolved');
    expect(store.hasUnsavedChanges()).toBe(true);
  });

  it('saves the review and shows the saved status in the details card', async () => {
    const { store, savedReviews } = createStore();
    store.loadComplaint('complaint-1');
    store.changeStatus('inReview');
    store.changeNotes('  قيد التحقق  ');

    expect(await store.saveReview()).toBe(true);

    expect(savedReviews).toEqual([{ status: 'inReview', adminNotes: 'قيد التحقق' }]);
    expect(store.view()?.statusLabel).toBe('قيد المراجعة');
    expect(store.hasUnsavedChanges()).toBe(false);
    expect(store.isSaved()).toBe(true);
  });

  it('keeps the draft and the error when the save fails', async () => {
    const { store } = createStore({
      saveReview: () => throwError(() => new Error('تعذر حفظ التغييرات')),
    });
    store.loadComplaint('complaint-1');
    store.changeStatus('rejected');

    expect(await store.saveReview()).toBe(false);

    expect(store.saveError()).toBe('تعذر حفظ التغييرات');
    expect(store.draftStatus()).toBe('rejected');
    expect(store.isSaved()).toBe(false);
  });

  it('does not save before the complaint has loaded', async () => {
    const { store, savedReviews } = createStore({ getComplaint: () => of() });

    expect(await store.saveReview()).toBe(false);
    expect(savedReviews).toEqual([]);
  });
});
