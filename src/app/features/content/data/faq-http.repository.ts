import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { LiveEnvelope } from '../../../core/http/live-envelope';
import { FaqQuestion } from '../models/faq-question';
import { FaqQuestionDraft } from '../models/faq-question-draft';
import { FaqRepository } from './faq.repository';
import { toLiveFaqBody } from './live-content-page-bodies';

@Injectable()
export class FaqHttpRepository implements FaqRepository {
  private readonly httpClient = inject(HttpClient);
  private readonly faqUrl = `${inject(API_BASE_URL)}/admin/content/faq`;

  getQuestions(): Observable<readonly FaqQuestion[]> {
    return this.httpClient
      .get<LiveEnvelope<readonly FaqQuestion[]>>(this.faqUrl)
      .pipe(map(({ data }) => data));
  }

  addQuestion(draft: FaqQuestionDraft): Observable<FaqQuestion> {
    return this.httpClient
      .post<LiveEnvelope<FaqQuestion>>(this.faqUrl, toLiveFaqBody(draft))
      .pipe(map(({ data }) => data));
  }

  updateQuestion(id: string, draft: FaqQuestionDraft): Observable<FaqQuestion> {
    return this.httpClient
      .post<LiveEnvelope<FaqQuestion>>(`${this.faqUrl}/${id}`, {
        ...toLiveFaqBody(draft),
        _method: 'PUT',
      })
      .pipe(map(({ data }) => data));
  }

  deleteQuestion(id: string): Observable<void> {
    return this.httpClient.delete(`${this.faqUrl}/${id}`).pipe(map(() => undefined));
  }
}
