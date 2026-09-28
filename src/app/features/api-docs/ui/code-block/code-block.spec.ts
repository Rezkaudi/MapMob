import { TestBed } from '@angular/core/testing';
import { ClipboardWriter } from './clipboard-writer';
import { CodeBlock } from './code-block';

const clipboard = { write: vi.fn(() => Promise.resolve()) };

function render(code: string, language: 'json' | 'bash' | 'text' = 'json') {
  TestBed.configureTestingModule({
    providers: [{ provide: ClipboardWriter, useValue: clipboard }],
  });
  const fixture = TestBed.createComponent(CodeBlock);
  fixture.componentRef.setInput('code', code);
  fixture.componentRef.setInput('language', language);
  fixture.componentRef.setInput('label', 'Response');
  fixture.detectChanges();
  return fixture;
}

describe('CodeBlock', () => {
  beforeEach(() => clipboard.write.mockClear());

  it('shows the code and its label', () => {
    const element: HTMLElement = render('{"id": "12"}').nativeElement;

    expect(element.querySelector('pre')?.textContent).toBe('{"id": "12"}');
    expect(element.textContent).toContain('Response');
  });

  it('colours the JSON keys', () => {
    const element: HTMLElement = render('{"id": "12"}').nativeElement;

    expect(element.querySelector('[data-token="key"]')?.textContent).toBe('"id"');
  });

  it('does not colour a shell command as JSON', () => {
    const element: HTMLElement = render('curl "$API_BASE_URL/places"', 'bash').nativeElement;

    expect(element.querySelector('[data-token="string"]')).toBeNull();
  });

  it('sets Arabic text in the Arabic font so its letters join', () => {
    const element: HTMLElement = render('{"name": "مطاعم"}').nativeElement;
    const arabic = element.querySelector('[data-script="arabic"]');

    expect(arabic?.textContent).toBe('مطاعم');
    expect(arabic?.classList.contains('font-sans')).toBe(true);
    expect(element.querySelector('pre')?.textContent).toBe('{"name": "مطاعم"}');
  });

  it('copies the code and says so', async () => {
    const fixture = render('{"id": "12"}');
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');

    button.click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(clipboard.write).toHaveBeenCalledWith('{"id": "12"}');
    expect(button.textContent?.trim()).toBe('Copied');
  });
});
