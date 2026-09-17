import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { ContentMockDatabaseLoader } from './content-mock-database-loader';

describe('ContentMockDatabaseLoader', () => {
  it('builds the database from the seed once, and hands the same one to every request', async () => {
    TestBed.configureTestingModule({ providers: [ContentMockDatabaseLoader] });
    const loader = TestBed.inject(ContentMockDatabaseLoader);

    const pageCount = await firstValueFrom(
      loader.request((database) => database.listPages().length),
    );
    await firstValueFrom(loader.request((database) => database.deleteQuestion('faq-4')));
    const questionCount = await firstValueFrom(
      loader.request((database) => database.listQuestions().length),
    );

    expect(pageCount).toBe(5);
    expect(questionCount).toBe(3);
  });

  it('reports a failing request as an error event', async () => {
    TestBed.configureTestingModule({ providers: [ContentMockDatabaseLoader] });
    const loader = TestBed.inject(ContentMockDatabaseLoader);

    await expect(
      firstValueFrom(loader.request((database) => database.deleteQuestion('missing'))),
    ).rejects.toThrow('لم يتم العثور على السؤال');
  });
});
