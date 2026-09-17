import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { FaqRepository } from '../../data/faq.repository';
import { buildFaqQuestion } from '../../testing/content-fixture';
import { FaqPage } from './faq-page';

function render(
  questions = [buildFaqQuestion(), buildFaqQuestion({ id: 'faq-2', question: 'سؤال ثان؟' })],
) {
  const deleted: string[] = [];
  const repository: Partial<FaqRepository> = {
    getQuestions: () => of(questions),
    addQuestion: (draft) => of({ id: 'faq-3', ...draft }),
    deleteQuestion: (id) => {
      deleted.push(id);
      return of(undefined);
    },
  };
  TestBed.configureTestingModule({
    providers: [provideRouter([]), { provide: FaqRepository, useValue: repository }],
  });
  const fixture = TestBed.createComponent(FaqPage);
  fixture.detectChanges();
  return { fixture, element: fixture.nativeElement as HTMLElement, deleted };
}

function buttonNamed(root: ParentNode, label: string): HTMLButtonElement {
  return Array.from(root.querySelectorAll('button')).find(
    (button) => button.textContent?.trim() === label,
  ) as HTMLButtonElement;
}

async function settle(fixture: { whenStable(): Promise<unknown>; detectChanges(): void }) {
  await fixture.whenStable();
  fixture.detectChanges();
}

describe('FaqPage', () => {
  it('heads the page with the add button beside the title', () => {
    const { element } = render();

    expect(element.querySelector('h1')?.textContent?.trim()).toBe('الأسئلة الشائعة');
    expect(
      element.querySelector('[data-role="heading-row"] app-add-button')?.textContent?.trim(),
    ).toBe('إضافة سؤال جديد');
  });

  it('lists the questions under the header with their count', () => {
    const { element } = render();

    expect(element.querySelectorAll('app-faq-question-item')).toHaveLength(2);
    expect(element.querySelector('[data-role="question-count"]')?.textContent?.trim()).toBe('2');
  });

  it('adds a question through the dialog', async () => {
    const { fixture, element } = render();
    buttonNamed(element, 'إضافة سؤال جديد').click();
    fixture.detectChanges();

    const question = element.querySelector('#faq-question') as HTMLInputElement;
    question.value = 'سؤال جديد؟';
    question.dispatchEvent(new Event('input'));
    const answer = element.querySelector('#faq-answer') as HTMLTextAreaElement;
    answer.value = 'نعم';
    answer.dispatchEvent(new Event('input'));
    buttonNamed(element, 'إضافة السؤال').click();
    await settle(fixture);

    expect(element.querySelector('app-faq-question-dialog')).toBeNull();
    expect(element.querySelectorAll('app-faq-question-item')).toHaveLength(3);
  });

  it('deletes a question after the confirmation', async () => {
    const { fixture, element, deleted } = render();
    (element.querySelector('button[aria-label="حذف السؤال 2"]') as HTMLButtonElement).click();
    fixture.detectChanges();

    const confirm = element.querySelector('app-confirm-action-dialog') as HTMLElement;
    expect(confirm.textContent).toContain('حذف السؤال من التطبيق؟');
    expect(confirm.textContent).toContain('هل أنت متأكد من حذف هذا السؤال؟');
    buttonNamed(confirm, 'حذف السؤال').click();
    await settle(fixture);

    expect(deleted).toEqual(['faq-2']);
    expect(element.querySelector('app-confirm-action-dialog')).toBeNull();
    expect(element.querySelectorAll('app-faq-question-item')).toHaveLength(1);
  });

  it('says when there are no questions yet', () => {
    const { element } = render([]);

    expect(element.textContent).toContain('لا توجد أسئلة بعد');
  });
});
