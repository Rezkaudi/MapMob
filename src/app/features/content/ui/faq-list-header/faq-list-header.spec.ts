import { TestBed } from '@angular/core/testing';
import { FaqListHeader } from './faq-list-header';

function render() {
  const fixture = TestBed.createComponent(FaqListHeader);
  fixture.componentRef.setInput('questionCount', 10);
  fixture.detectChanges();
  return { fixture, element: fixture.nativeElement as HTMLElement };
}

describe('FaqListHeader', () => {
  it('names the list and counts its questions', () => {
    const { element } = render();

    expect(element.querySelector('h2')?.textContent?.trim()).toBe('قائمة الأسئلة المعروضة');
    expect(element.querySelector('[data-role="question-count"]')?.textContent?.trim()).toBe('10');
  });

  it('puts "expand all" before "collapse all", which RTL draws right to left', () => {
    const { fixture, element } = render();
    const events: string[] = [];
    fixture.componentInstance.expandAll.subscribe(() => events.push('expand'));
    fixture.componentInstance.collapseAll.subscribe(() => events.push('collapse'));
    const buttons = element.querySelectorAll('button');

    expect(Array.from(buttons).map((button) => button.textContent?.trim())).toEqual([
      'توسيع الكل',
      'طي الكل',
    ]);
    buttons[0].click();
    buttons[1].click();
    expect(events).toEqual(['expand', 'collapse']);
  });
});
