import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { FaqHttpRepository } from './faq-http.repository';

const BASE_URL = 'https://api.test';
const DRAFT = { question: 'سؤال؟', answer: 'جواب' };

describe('FaqHttpRepository', () => {
  let repository: FaqHttpRepository;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FaqHttpRepository,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_BASE_URL, useValue: BASE_URL },
      ],
    });
    repository = TestBed.inject(FaqHttpRepository);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('asks for the questions', () => {
    repository.getQuestions().subscribe();

    http.expectOne({ method: 'GET', url: `${BASE_URL}/content/faq` }).flush([]);
  });

  it('adds a question', () => {
    repository.addQuestion(DRAFT).subscribe();

    const request = http.expectOne({ method: 'POST', url: `${BASE_URL}/content/faq` });
    expect(request.request.body).toEqual(DRAFT);
    request.flush({});
  });

  it('updates a question', () => {
    repository.updateQuestion('faq-2', DRAFT).subscribe();

    const request = http.expectOne({ method: 'PUT', url: `${BASE_URL}/content/faq/faq-2` });
    expect(request.request.body).toEqual(DRAFT);
    request.flush({});
  });

  it('deletes a question', () => {
    repository.deleteQuestion('faq-2').subscribe();

    http.expectOne({ method: 'DELETE', url: `${BASE_URL}/content/faq/faq-2` }).flush(null);
  });
});
