import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { firstValueFrom } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { FaqHttpRepository } from './faq-http.repository';

const FAQ_URL = 'https://api.test/admin/content/faq';
const DRAFT = { question: 'سؤال؟', answer: 'جواب' };
const SAVED = { id: '2', ...DRAFT };
const IN_BOTH_LANGUAGES = {
  question: { ar: 'سؤال؟', en: 'سؤال؟' },
  answer: { ar: 'جواب', en: 'جواب' },
};

describe('FaqHttpRepository', () => {
  let repository: FaqHttpRepository;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FaqHttpRepository,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_BASE_URL, useValue: 'https://api.test' },
      ],
    });
    repository = TestBed.inject(FaqHttpRepository);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('reads the questions', async () => {
    const response = firstValueFrom(repository.getQuestions());

    http.expectOne({ method: 'GET', url: FAQ_URL }).flush({ data: [SAVED] });

    expect(await response).toEqual([SAVED]);
  });

  it('adds a question in both languages', async () => {
    const response = firstValueFrom(repository.addQuestion(DRAFT));

    const request = http.expectOne({ method: 'POST', url: FAQ_URL });
    expect(request.request.body).toEqual(IN_BOTH_LANGUAGES);
    request.flush({ data: SAVED });

    expect(await response).toEqual(SAVED);
  });

  it('updates a question with PUT inside the POST', async () => {
    const response = firstValueFrom(repository.updateQuestion('2', DRAFT));

    const request = http.expectOne({ method: 'POST', url: `${FAQ_URL}/2` });
    expect(request.request.body).toEqual({ ...IN_BOTH_LANGUAGES, _method: 'PUT' });
    request.flush({ data: SAVED });

    expect(await response).toEqual(SAVED);
  });

  it('deletes a question', async () => {
    const response = firstValueFrom(repository.deleteQuestion('2'), { defaultValue: undefined });

    http.expectOne({ method: 'DELETE', url: `${FAQ_URL}/2` }).flush({ status: true });

    await response;
  });
});
