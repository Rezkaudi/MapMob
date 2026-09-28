import { TestBed } from '@angular/core/testing';
import { SignOutPanel } from './sign-out-panel';

const ADMIN_DESCRIPTION = 'سيتم إنهاء الجلسة والعودة لشاشة الدخول الرئيسية للمشرفين.';

function render(description?: string) {
  const fixture = TestBed.createComponent(SignOutPanel);
  if (description !== undefined) {
    fixture.componentRef.setInput('description', description);
  }
  fixture.detectChanges();
  return fixture;
}

describe('SignOutPanel', () => {
  it('explains what signing out does and asks for it on the button', () => {
    const fixture = render(ADMIN_DESCRIPTION);
    let requests = 0;
    fixture.componentInstance.signOut.subscribe(() => requests++);
    const element = fixture.nativeElement as HTMLElement;

    expect(element.textContent).toContain('تسجيل الخروج من الجلسة الحالية');
    expect(element.textContent).toContain(ADMIN_DESCRIPTION);
    (element.querySelector('button') as HTMLButtonElement).click();

    expect(requests).toBe(1);
  });

  it('draws the title line alone when no description is given, as the merchant frame does', () => {
    const element = render().nativeElement as HTMLElement;

    expect(Array.from(element.querySelectorAll('p'), (line) => line.textContent?.trim())).toEqual([
      'تسجيل الخروج من الجلسة الحالية',
    ]);
  });
});
