import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { buildComplaintDetail } from '../../testing/complaint-fixture';
import { ComplaintReporterCard } from './complaint-reporter-card';

function render() {
  TestBed.configureTestingModule({ providers: [provideRouter([])] });
  const fixture = TestBed.createComponent(ComplaintReporterCard);
  fixture.componentRef.setInput('reporter', buildComplaintDetail().reporter);
  fixture.componentRef.setInput('profileLink', '/users/user-1');
  fixture.detectChanges();
  return fixture.nativeElement as HTMLElement;
}

describe('ComplaintReporterCard', () => {
  it('shows the reporter name, email and phone', () => {
    const element = render();

    expect(element.querySelector('h2')?.textContent?.trim()).toBe('بيانات المُبلّغ');
    expect(element.textContent).toContain('سارة علي');
    const contacts = Array.from(element.querySelectorAll('[data-role="contact"]'));
    expect(contacts.map((contact) => contact.textContent?.trim())).toEqual([
      'sara.r@example.com',
      '+966 54 123 4567',
    ]);
    expect(contacts.every((contact) => contact.getAttribute('dir') === 'ltr')).toBe(true);
  });

  it('links to the reporter profile', () => {
    const link = render().querySelector('a') as HTMLAnchorElement;

    expect(link.textContent?.trim()).toBe('عرض الملف الشخصي للمستخدم');
    expect(link.getAttribute('href')).toBe('/users/user-1');
  });
});
