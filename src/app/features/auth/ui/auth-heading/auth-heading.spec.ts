import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AuthHeading } from './auth-heading';

function render(inputs: Record<string, unknown>) {
  TestBed.configureTestingModule({ providers: [provideRouter([])] });
  const fixture = TestBed.createComponent(AuthHeading);
  for (const [name, value] of Object.entries(inputs)) {
    fixture.componentRef.setInput(name, value);
  }
  fixture.detectChanges();
  return fixture.nativeElement as HTMLElement;
}

describe('AuthHeading', () => {
  it('shows the title as the page heading and the description under it', () => {
    const element = render({ title: 'رمز التحقق', description: 'أرسلنا رمز تحقق' });

    expect(element.querySelector('h1')!.textContent!.trim()).toBe('رمز التحقق');
    expect(element.querySelector('p')!.textContent!.trim()).toBe('أرسلنا رمز تحقق');
  });

  it('has no back link unless a route is given', () => {
    const element = render({ title: 'إنشاء كلمة مرور جديدة', description: 'x' });

    expect(element.querySelector('a')).toBeNull();
  });

  it('writes the chevron before the back label, so RTL puts it on the right', () => {
    const element = render({
      title: 'نسيت كلمة المرور؟',
      description: 'x',
      backRoute: '/login?role=merchant',
    });

    const link = element.querySelector('a')!;
    expect(link.getAttribute('href')).toBe('/login?role=merchant');
    expect(link.textContent!.trim()).toBe('العودة إلى تسجيل الدخول');
    expect(link.children[0].tagName).toBe('APP-ICON');
  });

  it('spaces the description letters only when asked, as the login frame does', () => {
    expect(render({ title: 't', description: 'd' }).querySelector('p')!.classList).not.toContain(
      'tracking-[0.5px]',
    );
    TestBed.resetTestingModule();
    expect(
      render({ title: 't', description: 'd', hasSpacedDescription: true }).querySelector('p')!
        .classList,
    ).toContain('tracking-[0.5px]');
  });

  it('lets the description run 14px past the column, as the frames draw it 396px wide', () => {
    const paragraph = render({ title: 't', description: 'd' }).querySelector('p')!;

    expect(paragraph.classList).toContain('w-[396px]');
    expect(paragraph.classList).toContain('max-w-[calc(100%+14px)]');
  });

  it('keeps a query string in the back link, so it can open the merchant tab of /login', () => {
    const element = render({ title: 't', description: 'd', backRoute: '/login?role=merchant' });

    expect(element.querySelector('a')!.getAttribute('href')).toBe('/login?role=merchant');
  });
});
