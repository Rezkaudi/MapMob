import { TestBed } from '@angular/core/testing';
import { FaqQuestion } from '../../models/faq-question';
import { buildFaqQuestion } from '../../testing/content-fixture';
import { FaqQuestionItem } from './faq-question-item';

function render(isExpanded: boolean) {
  const fixture = TestBed.createComponent(FaqQuestionItem);
  fixture.componentRef.setInput('question', buildFaqQuestion());
  fixture.componentRef.setInput('number', 1);
  fixture.componentRef.setInput('isExpanded', isExpanded);
  fixture.detectChanges();
  const events: string[] = [];
  const instance = fixture.componentInstance;
  instance.toggle.subscribe(() => events.push('toggle'));
  instance.edit.subscribe((question: FaqQuestion) => events.push(`edit ${question.id}`));
  instance.remove.subscribe((question: FaqQuestion) => events.push(`remove ${question.id}`));
  return { element: fixture.nativeElement as HTMLElement, events };
}

describe('FaqQuestionItem', () => {
  it('shows the number left to right, the question, and the open answer', () => {
    const { element } = render(true);
    const toggle = element.querySelector('button[aria-expanded]') as HTMLButtonElement;

    expect(element.querySelector('[data-role="question-number"]')?.textContent?.trim()).toBe('#1');
    expect(element.querySelector('[data-role="question-number"]')?.getAttribute('dir')).toBe('ltr');
    expect(element.querySelector('h3')?.textContent?.trim()).toBe('ما هو تطبيق MapMob؟');
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    expect(element.querySelector('[data-role="answer"]')?.textContent?.trim()).toBe(
      'MapMob هو دليل جغرافي ذكي وتفاعلي.',
    );
  });

  it('hides the answer of a closed question and tints its number grey', () => {
    const { element } = render(false);

    expect(element.querySelector('[data-role="answer"]')).toBeNull();
    expect(element.querySelector('[data-role="question-number"]')?.classList).toContain(
      'bg-[#f1f5f9]',
    );
  });

  it('reports the toggle, edit and delete presses', () => {
    const { element, events } = render(false);

    (element.querySelector('button[aria-expanded]') as HTMLButtonElement).click();
    (element.querySelector('button[aria-label="تعديل السؤال 1"]') as HTMLButtonElement).click();
    (element.querySelector('button[aria-label="حذف السؤال 1"]') as HTMLButtonElement).click();

    expect(events).toEqual(['toggle', 'edit faq-1', 'remove faq-1']);
  });
});
