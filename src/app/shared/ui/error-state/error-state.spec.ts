import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ErrorState } from './error-state';

@Component({
  imports: [ErrorState],
  template: `<app-error-state [message]="message" (retry)="retryCount.set(retryCount() + 1)" />`,
})
class HostComponent {
  readonly message = 'تعذر تحميل البيانات';
  readonly retryCount = signal(0);
}

describe('ErrorState', () => {
  it('shows the message as an alert', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const alert: HTMLElement = fixture.nativeElement.querySelector('[role="alert"]');
    expect(alert.textContent).toContain('تعذر تحميل البيانات');
  });

  it('asks the page to load again when the retry button is pressed', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    fixture.nativeElement.querySelector('button').click();

    expect(fixture.componentInstance.retryCount()).toBe(1);
  });
});
