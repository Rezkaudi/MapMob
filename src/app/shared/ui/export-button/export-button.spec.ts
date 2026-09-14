import { TestBed } from '@angular/core/testing';
import { ExportButton } from './export-button';

describe('ExportButton', () => {
  function render(isBusy = false) {
    const fixture = TestBed.createComponent(ExportButton);
    fixture.componentRef.setInput('isBusy', isBusy);
    fixture.detectChanges();
    return fixture;
  }

  it('reports a press', () => {
    const fixture = render();
    const pressed = vi.fn();
    fixture.componentInstance.pressed.subscribe(pressed);

    (fixture.nativeElement.querySelector('button') as HTMLButtonElement).click();

    expect(pressed).toHaveBeenCalledOnce();
  });

  it('cannot be pressed again while the file is being made', () => {
    const button = render(true).nativeElement.querySelector('button') as HTMLButtonElement;

    expect(button.disabled).toBe(true);
    expect(button.getAttribute('aria-busy')).toBe('true');
  });
});
