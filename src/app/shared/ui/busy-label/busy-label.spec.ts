import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { BusyLabel } from './busy-label';

@Component({
  imports: [BusyLabel],
  template: `<app-busy-label [isBusy]="isBusy()">حفظ</app-busy-label>`,
})
class HostComponent {
  readonly isBusy = signal(false);
}

describe('BusyLabel', () => {
  function render(isBusy: boolean) {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.isBusy.set(isBusy);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('shows only the text while idle', () => {
    const element = render(false);

    expect(element.textContent?.trim()).toBe('حفظ');
    expect(element.querySelector('app-spinner')).toBeNull();
  });

  it('puts a spinner beside the text while busy', () => {
    const element = render(true);

    expect(element.querySelector('app-spinner')).not.toBeNull();
    expect(element.textContent).toContain('حفظ');
  });

  it('fills the button as a centred row, so a tall spinner cannot lift the text off the middle', () => {
    const element = render(true);

    const host = element.querySelector('app-busy-label') as HTMLElement;
    expect(host.classList).toContain('flex');
    expect(host.classList).not.toContain('inline-flex');
    expect(host.classList).toContain('items-center');
    expect(host.classList).toContain('justify-center');
  });
});

