import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { EditingCommandRunner } from '../../editing/editing-command-runner';
import { RichTextEditor } from './rich-text-editor';

@Component({
  imports: [ReactiveFormsModule, RichTextEditor],
  template: `<app-rich-text-editor
    [formControl]="body"
    appearance="document"
    ariaLabel="محتوى الصفحة"
  />`,
})
class EditorHost {
  readonly body = new FormControl('<p>نص <script>alert(1)</script>أول</p>', { nonNullable: true });
}

function render() {
  const runs: { name: string; value?: string }[] = [];
  const runner: Partial<EditingCommandRunner> = {
    run: (name: string, value?: string) => {
      runs.push(value === undefined ? { name } : { name, value });
    },
    isActive: () => false,
    valueOf: () => 'p',
  };
  TestBed.configureTestingModule({
    providers: [{ provide: EditingCommandRunner, useValue: runner }],
  });
  const fixture = TestBed.createComponent(EditorHost);
  fixture.detectChanges();
  const element = fixture.nativeElement as HTMLElement;
  const area = element.querySelector('[contenteditable="true"]') as HTMLElement;
  return { fixture, element, area, runs, host: fixture.componentInstance };
}

/** Focusing the editor always sets the paragraph separator first; these tests look past it. */
function commandRuns(runs: { name: string; value?: string }[]) {
  return runs.filter((run) => run.name !== 'defaultParagraphSeparator');
}

function buttonLabeled(root: HTMLElement, label: string): HTMLButtonElement {
  return root.querySelector(`button[aria-label="${label}"]`) as HTMLButtonElement;
}

describe('RichTextEditor', () => {
  afterEach(() => vi.restoreAllMocks());

  it('shows the form value as rich text, with unsafe markup removed', () => {
    const { area } = render();

    expect(area.innerHTML).toContain('<p>نص');
    expect(area.innerHTML).not.toContain('script');
    expect(area.getAttribute('role')).toBe('textbox');
    expect(area.getAttribute('aria-multiline')).toBe('true');
    expect(area.getAttribute('aria-label')).toBe('محتوى الصفحة');
  });

  it('writes what is typed back to the form, and nothing for an emptied editor', () => {
    const { area, host } = render();

    area.innerHTML = '<p>نص جديد</p>';
    area.dispatchEvent(new Event('input'));
    expect(host.body.value).toBe('<p>نص جديد</p>');

    area.innerHTML = '<p><br></p>';
    area.dispatchEvent(new Event('input'));
    expect(host.body.value).toBe('');
  });

  it('shows a new value set from outside', () => {
    const { fixture, area, host } = render();

    host.body.setValue('<h2>عنوان</h2>');
    fixture.detectChanges();

    expect(area.innerHTML).toBe('<h2>عنوان</h2>');
  });

  it('marks the form control touched when the editor loses focus', () => {
    const { area, host } = render();

    area.dispatchEvent(new Event('blur'));

    expect(host.body.touched).toBe(true);
  });

  it('runs a toolbar command on the text and saves the result', () => {
    const { element, runs, host, area } = render();
    area.innerHTML = '<p><b>نص</b></p>';

    buttonLabeled(element, 'عريض').click();

    expect(commandRuns(runs)).toEqual([{ name: 'bold' }]);
    expect(host.body.value).toBe('<p><b>نص</b></p>');
  });

  it('asks for the link address and adds a safe link', () => {
    const { element, runs } = render();
    vi.spyOn(window, 'prompt').mockReturnValueOnce('mapmob.app').mockReturnValueOnce(null);

    buttonLabeled(element, 'إضافة رابط').click();
    buttonLabeled(element, 'إضافة رابط').click();

    expect(commandRuns(runs)).toEqual([{ name: 'createLink', value: 'https://mapmob.app' }]);
  });

  it('pastes plain text only, so copied styles do not come along', () => {
    const { area, runs } = render();
    const paste = new Event('paste', { cancelable: true }) as Event & { clipboardData: unknown };
    Object.defineProperty(paste, 'clipboardData', {
      value: { getData: (type: string) => (type === 'text/plain' ? 'نص منسوخ' : '') },
    });

    area.dispatchEvent(paste);

    expect(paste.defaultPrevented).toBe(true);
    expect(runs).toEqual([{ name: 'insertText', value: 'نص منسوخ' }]);
  });

  it('starts new lines as paragraphs once the editor has focus', () => {
    const { area, runs } = render();

    area.dispatchEvent(new Event('focus'));

    expect(runs).toEqual([{ name: 'defaultParagraphSeparator', value: 'p' }]);
  });

  it('sizes and colours the text for the chosen appearance', () => {
    const { area } = render();

    expect(area.classList).toContain('text-[14px]/[20px]');
    expect(area.classList).toContain('text-text-primary');
  });
});
