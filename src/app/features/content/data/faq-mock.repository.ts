import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { FaqQuestion } from '../models/faq-question';
import { FaqQuestionDraft } from '../models/faq-question-draft';
import { ContentMockDatabaseLoader } from './content-mock-database-loader';
import { FaqRepository } from './faq.repository';

@Injectable()
export class FaqMockRepository implements FaqRepository {
  private readonly loader = inject(ContentMockDatabaseLoader);

  getQuestions(): Observable<readonly FaqQuestion[]> {
    return this.loader.request((database) => database.listQuestions());
  }

  addQuestion(draft: FaqQuestionDraft): Observable<FaqQuestion> {
    return this.loader.request((database) => database.addQuestion(draft));
  }

  updateQuestion(id: string, draft: FaqQuestionDraft): Observable<FaqQuestion> {
    return this.loader.request((database) => database.updateQuestion(id, draft));
  }

  deleteQuestion(id: string): Observable<void> {
    return this.loader.request((database) => database.deleteQuestion(id));
  }
}
