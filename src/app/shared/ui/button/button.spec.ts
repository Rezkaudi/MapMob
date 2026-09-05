import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Button } from './button';

@Component({
  imports: [Button],
  template: `<button app-button variant="primary" (buttonClick)="onClick()">حفظ</button>`,
})
class HostComponent {
  clicked = false;
  onClick(): void {
    this.clicked = true;
  }
}

@Component({
  imports: [Button],
  template: `<button app-button [isLoading]="true">حفظ</button>`,
})
class HostLoadingComponent {}

describe('Button', () => {
  it('emits buttonClick when clicked', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    fixture.debugElement.query(By.css('button')).nativeElement.click();

    expect(fixture.componentInstance.clicked).toBe(true);
  });

  it('applies the primary variant classes', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button') as HTMLElement;
    expect(button.className).toContain('bg-primary');
  });
  it('spins and blocks clicks while it is working', () => {
    const fixture = TestBed.createComponent(HostLoadingComponent);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(button.disabled).toBe(true);
    expect(button.getAttribute('aria-busy')).toBe('true');
    expect(button.querySelector('app-spinner')).toBeTruthy();
  });

  it('shows no spinner when it is idle', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('app-spinner')).toBeNull();
  });
});
