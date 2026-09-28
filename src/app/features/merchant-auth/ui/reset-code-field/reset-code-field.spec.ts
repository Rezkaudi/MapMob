import { TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { ResetCodeField } from './reset-code-field';

function render() {
  const control = new FormControl('', { nonNullable: true });
  const fixture = TestBed.createComponent(ResetCodeField);
  fixture.componentRef.setInput('control', control);
  fixture.componentRef.setInput('labelId', 'code-label');
  fixture.detectChanges();
  const boxes = (): HTMLInputElement[] => [...fixture.nativeElement.querySelectorAll('input')];
  return { fixture, boxes, control };
}

function type(box: HTMLInputElement, text: string) {
  box.value = text;
  box.dispatchEvent(new Event('input'));
}

describe('ResetCodeField', () => {
  it('draws six numeric boxes, named by the label', () => {
    const { fixture, boxes } = render();

    expect(boxes().length).toBe(6);
    expect(boxes()[0].inputMode).toBe('numeric');
    expect(
      fixture.nativeElement.querySelector('[role="group"]').getAttribute('aria-labelledby'),
    ).toBe('code-label');
  });

  it('lays the boxes out left to right, the way a number is read', () => {
    const { fixture } = render();

    expect(fixture.nativeElement.querySelector('[role="group"]').getAttribute('dir')).toBe('ltr');
  });

  it('writes the typed digit, fills the control and jumps to the next box', () => {
    const { fixture, boxes, control } = render();

    type(boxes()[0], '7');
    fixture.detectChanges();

    expect(control.value).toBe('7');
    expect(document.activeElement).toBe(boxes()[1]);
  });

  it('spreads a pasted code over all six boxes', () => {
    const { fixture, boxes, control } = render();

    type(boxes()[0], '123456');
    fixture.detectChanges();

    expect(control.value).toBe('123456');
    expect(boxes().map((box) => box.value)).toEqual(['1', '2', '3', '4', '5', '6']);
  });

  it('steps back to the previous box on Backspace in an empty box', () => {
    const { fixture, boxes } = render();
    type(boxes()[0], '1');
    fixture.detectChanges();

    boxes()[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace' }));
    fixture.detectChanges();

    expect(document.activeElement).toBe(boxes()[0]);
  });

  it('empties every box when the control is reset', () => {
    const { fixture, boxes, control } = render();
    type(boxes()[0], '123456');
    fixture.detectChanges();

    control.reset();
    fixture.detectChanges();

    expect(boxes().map((box) => box.value)).toEqual(['', '', '', '', '', '']);
  });
});
