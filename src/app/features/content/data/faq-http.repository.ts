import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { FaqQuestion } from '../models/faq-question';
import { FaqQuestionDraft } from '../models/faq-question-draft';
import { FaqRepository } from './faq.repository';

@Injectable()
export class FaqHttpRepository implements FaqRepository {
  private readonly httpClient = inject(HttpClient);
  private readonly apiBaseUrl = inject(API_BASE_URL);

  private get faqUrl(): string {
    return `${this.apiBaseUrl}/content/faq`;
  }

  getQuestions(): Observable<readonly FaqQuestion[]> {
    return this.httpClient.get<readonly FaqQuestion[]>(this.faqUrl);
  }

  addQuestion(draft: FaqQuestionDraft): Observable<FaqQuestion> {
    return this.httpClient.post<FaqQuestion>(this.faqUrl, draft);
  }

  updateQuestion(id: string, draft: FaqQuestionDraft): Observable<FaqQuestion> {
    return this.httpClient.put<FaqQuestion>(`${this.faqUrl}/${id}`, draft);
  }

  deleteQuestion(id: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.faqUrl}/${id}`);
  }
}
