import { TestBed } from '@angular/core/testing';
import { SignOutPanel } from './sign-out-panel';

describe('SignOutPanel', () => {
  it('explains what signing out does and asks for it on the button', () => {
    const fixture = TestBed.createComponent(SignOutPanel);
    let requests = 0;
    fixture.componentInstance.signOut.subscribe(() => requests++);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;

    expect(element.textContent).toContain('تسجيل الخروج من الجلسة الحالية');
    expect(element.textContent).toContain(
      'سيتم إنهاء الجلسة والعودة لشاشة الدخول الرئيسية للمشرفين.',
    );
    (element.querySelector('button') as HTMLButtonElement).click();

    expect(requests).toBe(1);
  });
});
