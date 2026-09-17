import { Observable } from 'rxjs';
import { FaqQuestion } from '../models/faq-question';
import { FaqQuestionDraft } from '../models/faq-question-draft';

export abstract class FaqRepository {
  abstract getQuestions(): Observable<readonly FaqQuestion[]>;
  abstract addQuestion(draft: FaqQuestionDraft): Observable<FaqQuestion>;
  abstract updateQuestion(id: string, draft: FaqQuestionDraft): Observable<FaqQuestion>;
  abstract deleteQuestion(id: string): Observable<void>;
}
