import { TestBed } from '@angular/core/testing';
import { EMPTY_RICH_TEXT_STATE, RichTextState } from '../../models/rich-text-state';
import { RichTextCommand } from '../../models/rich-text-command';
import { RichTextToolbar } from './rich-text-toolbar';

function render(state: RichTextState = EMPTY_RICH_TEXT_STATE) {
  const fixture = TestBed.createComponent(RichTextToolbar);
  fixture.componentRef.setInput('state', state);
  fixture.detectChanges();
  const commands: RichTextCommand[] = [];
  fixture.componentInstance.command.subscribe((command) => commands.push(command));
  return { element: fixture.nativeElement as HTMLElement, commands };
}

function buttonLabeled(root: HTMLElement, label: string): HTMLButtonElement {
  return root.querySelector(`button[aria-label="${label}"]`) as HTMLButtonElement;
}

describe('RichTextToolbar', () => {
  it('lays the groups out right to left as the design does, clear format last', () => {
    const { element } = render();
    const labels = Array.from(element.querySelectorAll('button')).map((button) =>
      button.getAttribute('aria-label'),
    );

    expect(labels).toEqual([
      'تراجع',
      'إعادة',
      'عنوان 1',
      'عنوان 2',
      'عنوان 3',
      'فقرة',
      'عريض',
      'مائل',
      'تسطير',
      'قائمة نقطية',
      'قائمة مرقمة',
      'إضافة رابط',
      'محاذاة لليمين',
      'توسيط',
      'محاذاة لليسار',
      'ضبط',
      'مسح التنسيق',
    ]);
    expect(element.querySelector('[role="toolbar"]')?.getAttribute('aria-label')).toBe(
      'أدوات تنسيق النص',
    );
  });

  it('keeps the "1." marker left to right, so RTL does not flip it to ".1"', () => {
    const { element } = render();
    const marker = buttonLabeled(element, 'قائمة مرقمة').querySelector('span') as HTMLElement;

    expect(marker.textContent).toBe('1.');
    expect(marker.getAttribute('dir')).toBe('ltr');
  });

  it('marks the formatting at the cursor as pressed', () => {
    const { element } = render({ ...EMPTY_RICH_TEXT_STATE, block: 'heading2', isBold: true });

    expect(buttonLabeled(element, 'عنوان 2').getAttribute('aria-pressed')).toBe('true');
    expect(buttonLabeled(element, 'عريض').getAttribute('aria-pressed')).toBe('true');
    expect(buttonLabeled(element, 'فقرة').getAttribute('aria-pressed')).toBe('false');
    expect(buttonLabeled(element, 'محاذاة لليمين').getAttribute('aria-pressed')).toBe('true');
    expect(buttonLabeled(element, 'تراجع').hasAttribute('aria-pressed')).toBe(false);
  });

  it('sends the pressed command and keeps the text selection', () => {
    const { element, commands } = render();
    const bold = buttonLabeled(element, 'عريض');
    const mouseDown = new MouseEvent('mousedown', { cancelable: true });

    bold.dispatchEvent(mouseDown);
    bold.click();
    buttonLabeled(element, 'إضافة رابط').click();

    expect(mouseDown.defaultPrevented).toBe(true);
    expect(commands).toEqual(['bold', 'link']);
  });
});
