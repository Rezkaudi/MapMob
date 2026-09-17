import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, of, pipe, switchMap, tap } from 'rxjs';
import { withRequestStatus } from '../../../shared/state/with-request-status';
import { withSaveStatus } from '../../../shared/state/with-save-status';
import { FaqRepository } from '../data/faq.repository';
import { FaqDialog } from '../models/faq-dialog';
import { FaqQuestion } from '../models/faq-question';
import { FaqQuestionDraft } from '../models/faq-question-draft';

export interface FaqRow {
  readonly question: FaqQuestion;
  readonly number: number;
  readonly isExpanded: boolean;
}

interface FaqState {
  readonly questions: readonly FaqQuestion[];
  readonly expandedIdSet: ReadonlySet<string>;
  readonly dialog: FaqDialog | null;
  readonly pendingDeletion: FaqQuestion | null;
}

const initialState: FaqState = {
  questions: [],
  expandedIdSet: new Set(),
  dialog: null,
  pendingDeletion: null,
};

export const FaqStore = signalStore(
  withState(initialState),
  withRequestStatus(),
  withSaveStatus(),
  withComputed(({ questions, expandedIdSet, isLoading }) => ({
    rows: computed<readonly FaqRow[]>(() =>
      questions().map((question, index) => ({
        question,
        number: index + 1,
        isExpanded: expandedIdSet().has(question.id),
      })),
    ),
    questionCount: computed(() => questions().length),
    hasNoQuestions: computed(() => !isLoading() && questions().length === 0),
  })),
  withMethods((store, repository = inject(FaqRepository)) => {
    const setExpanded = (ids: Iterable<string>) =>
      patchState(store, { expandedIdSet: new Set(ids) });

    const addQuestion = (draft: FaqQuestionDraft) =>
      repository.addQuestion(draft).pipe(
        tap((added) => {
          patchState(store, { questions: [...store.questions(), added] });
          setExpanded([...store.expandedIdSet(), added.id]);
        }),
      );

    const updateQuestion = (id: string, draft: FaqQuestionDraft) =>
      repository.updateQuestion(id, draft).pipe(
        tap((saved) =>
          patchState(store, {
            questions: store.questions().map((question) => (question.id === id ? saved : question)),
          }),
        ),
      );

    return {
      loadQuestions: rxMethod<void>(
        pipe(
          tap(() => store.setLoading()),
          switchMap(() =>
            repository.getQuestions().pipe(
              tap((questions) => {
                patchState(store, { questions });
                // The design opens the first answer so the list shows what an answer looks like.
                setExpanded(questions.slice(0, 1).map((question) => question.id));
                store.setLoaded();
              }),
              catchError((error: Error) => {
                store.setError(error.message);
                return of(null);
              }),
            ),
          ),
        ),
      ),
      toggleExpanded(id: string): void {
        const next = new Set(store.expandedIdSet());
        next.has(id) ? next.delete(id) : next.add(id);
        setExpanded(next);
      },
      expandAll(): void {
        setExpanded(store.questions().map((question) => question.id));
      },
      collapseAll(): void {
        setExpanded([]);
      },
      openAddDialog(): void {
        patchState(store, { dialog: { mode: 'add' } });
      },
      openEditDialog(question: FaqQuestion): void {
        const number = store.questions().indexOf(question) + 1;
        patchState(store, { dialog: { mode: 'edit', question, number } });
      },
      closeDialog(): void {
        patchState(store, { dialog: null });
        store.clearSaveError();
      },
      async saveQuestion(draft: FaqQuestionDraft): Promise<boolean> {
        const dialog = store.dialog();
        if (!dialog) {
          return false;
        }
        const request =
          dialog.mode === 'add' ? addQuestion(draft) : updateQuestion(dialog.question.id, draft);
        const isSaved = await store.runSave(request);
        if (isSaved) {
          patchState(store, { dialog: null });
        }
        return isSaved;
      },
      askToDelete(question: FaqQuestion): void {
        patchState(store, { pendingDeletion: question });
      },
      cancelDeletion(): void {
        patchState(store, { pendingDeletion: null });
        store.clearSaveError();
      },
      async confirmDeletion(): Promise<boolean> {
        const question = store.pendingDeletion();
        if (!question) {
          return false;
        }
        const isDeleted = await store.runSave(repository.deleteQuestion(question.id));
        if (isDeleted) {
          patchState(store, {
            questions: store.questions().filter((candidate) => candidate.id !== question.id),
            pendingDeletion: null,
          });
          setExpanded([...store.expandedIdSet()].filter((id) => id !== question.id));
        }
        return isDeleted;
      },
    };
  }),
);
