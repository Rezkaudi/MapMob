import { TestBed } from '@angular/core/testing';
import { FaqDialog } from '../../models/faq-dialog';
import { FaqQuestionDraft } from '../../models/faq-question-draft';
import { buildFaqQuestion } from '../../testing/content-fixture';
import { FaqQuestionDialog } from './faq-question-dialog';

function render(dialog: FaqDialog, saveError: string | null = null) {
  const fixture = TestBed.createComponent(FaqQuestionDialog);
  fixture.componentRef.setInput('dialog', dialog);
  fixture.componentRef.setInput('saveError', saveError);
  fixture.detectChanges();
  const saved: FaqQuestionDraft[] = [];
  let closes = 0;
  fixture.componentInstance.saved.subscribe((draft) => saved.push(draft));
  fixture.componentInstance.closed.subscribe(() => (closes += 1));
  return {
    fixture,
    element: fixture.nativeElement as HTMLElement,
    saved,
    closeCount: () => closes,
  };
}

function buttonNamed(root: ParentNode, label: string): HTMLButtonElement {
  return Array.from(root.querySelectorAll('button')).find(
    (button) => button.textContent?.trim() === label,
  ) as HTMLButtonElement;
}

function type(element: HTMLElement, selector: string, value: string): void {
  const field = element.querySelector(selector) as HTMLInputElement | HTMLTextAreaElement;
  field.value = value;
  field.dispatchEvent(new Event('input'));
}

describe('FaqQuestionDialog', () => {
  it('asks for a new question with empty fields and a character count', () => {
    const { element } = render({ mode: 'add' });

    expect(element.querySelector('[role="dialog"]')?.getAttribute('aria-modal')).toBe('true');
    expect(element.querySelector('h2')?.textContent?.trim()).toBe('إضافة سؤال جديد');
    expect(element.textContent).toContain('سيظهر هذا السؤال مباشرة في قائمة الأسئلة الشائعة.');
    expect((element.querySelector('#faq-question') as HTMLInputElement).placeholder).toBe(
      'اكتب نص السؤال بوضوع',
    );
    expect((element.querySelector('#faq-answer') as HTMLTextAreaElement).placeholder).toBe(
      'اكتب نص الإجابة بوضوع',
    );
    expect(element.querySelector('[data-role="answer-count"]')?.textContent?.trim()).toBe(
      '0 / 250',
    );
    expect(buttonNamed(element, 'إضافة السؤال')).toBeTruthy();
  });

  it('opens an edit filled with the question and its number', () => {
    const { element } = render({ mode: 'edit', question: buildFaqQuestion(), number: 1 });

    expect(element.querySelector('h2')?.textContent?.replace(/\s+/g, ' ').trim()).toBe(
      'تعديل السؤال (#1)',
    );
    expect(element.textContent).toContain('تعديل نص السؤال أو الإجابة الحالية.');
    expect((element.querySelector('#faq-question') as HTMLInputElement).value).toBe(
      'ما هو تطبيق MapMob؟',
    );
    expect((element.querySelector('#faq-answer') as HTMLTextAreaElement).value).toBe(
      'MapMob هو دليل جغرافي ذكي وتفاعلي.',
    );
    expect(element.querySelector('[data-role="answer-count"]')?.textContent?.trim()).toBe(
      '34 / 250',
    );
    expect(buttonNamed(element, 'حفظ التغييرات')).toBeTruthy();
  });

  it('sends the typed question', () => {
    const { fixture, element, saved } = render({ mode: 'add' });
    type(element, '#faq-question', ' سؤال جديد؟ ');
    type(element, '#faq-answer', 'جواب واضح');
    fixture.detectChanges();

    buttonNamed(element, 'إضافة السؤال').click();

    expect(saved).toEqual([{ question: 'سؤال جديد؟', answer: 'جواب واضح' }]);
  });

  it('does not send empty fields, and says what is missing', () => {
    const { fixture, element, saved } = render({ mode: 'add' });

    buttonNamed(element, 'إضافة السؤال').click();
    fixture.detectChanges();

    expect(saved).toEqual([]);
    expect(element.textContent).toContain('اكتب نص السؤال');
    expect(element.textContent).toContain('اكتب نص الإجابة');
  });

  it('closes from the cross, the cancel button and Escape', () => {
    const { element, closeCount } = render({ mode: 'add' });

    (element.querySelector('button[aria-label="إغلاق النافذة"]') as HTMLButtonElement).click();
    buttonNamed(element, 'إلغاء').click();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

    expect(closeCount()).toBe(3);
  });

  it('shows why the save failed', () => {
    const { element } = render({ mode: 'add' }, 'تعذر حفظ السؤال');

    expect(element.querySelector('[role="alert"]')?.textContent?.trim()).toBe('تعذر حفظ السؤال');
  });
});
