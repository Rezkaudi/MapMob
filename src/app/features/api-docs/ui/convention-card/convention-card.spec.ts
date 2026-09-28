import { TestBed } from '@angular/core/testing';
import { ClipboardWriter } from '../code-block/clipboard-writer';
import { ConventionCard } from './convention-card';

describe('ConventionCard', () => {
  it('shows the title, the text, the table and the sample', () => {
    TestBed.configureTestingModule({
      providers: [{ provide: ClipboardWriter, useValue: { write: vi.fn() } }],
    });
    const fixture = TestBed.createComponent(ConventionCard);
    fixture.componentRef.setInput('section', {
      id: 'paging',
      title: 'Paging',
      paragraphs: ['pageIndex is zero-based.'],
      table: { head: ['Name'], rows: [['pageIndex']] },
      code: 'GET /places?pageIndex=0',
    });
    fixture.detectChanges();
    const element: HTMLElement = fixture.nativeElement;

    expect(element.querySelector('h3')?.textContent).toContain('Paging');
    expect(element.textContent).toContain('pageIndex is zero-based.');
    expect(element.querySelector('td')?.textContent).toContain('pageIndex');
    expect(element.querySelector('pre')?.textContent).toBe('GET /places?pageIndex=0');
  });
});
