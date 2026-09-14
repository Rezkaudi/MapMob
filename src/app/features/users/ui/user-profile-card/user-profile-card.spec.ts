import { TestBed } from '@angular/core/testing';
import { buildUser } from '../../testing/user-fixture';
import { buildUserProfileView } from '../../state/user-profile-view';
import { UserProfileCard } from './user-profile-card';

const NOW = new Date('2024-01-14T00:10:00.000Z');

describe('UserProfileCard', () => {
  it('shows the avatar, the name, both pills and every detail line', () => {
    const user = buildUser({ lastActiveAt: '2024-01-14T00:00:00.000Z' });
    const fixture = TestBed.createComponent(UserProfileCard);
    fixture.componentRef.setInput('user', user);
    fixture.componentRef.setInput('profile', buildUserProfileView(user, NOW));
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    const text = element.textContent?.replace(/\s+/g, ' ') ?? '';
    const detailLines = Array.from(element.querySelectorAll('dl > div > div'), (item) =>
      Array.from(item.querySelectorAll('dt, dd'), (part) => part.textContent?.trim()).join(' '),
    );

    expect(element.querySelector('[data-role="avatar"]')?.textContent?.trim()).toBe('أ ج');
    expect(element.querySelector('h2')?.textContent?.trim()).toBe('أحمد جمال');
    expect(text).toContain('مسجل');
    expect(text).toContain('نشط الآن');
    expect(detailLines).toEqual([
      'البريد الالكتروني: ahmad@email.com',
      'رقم الهاتف: +966 50 123 4567',
      'المحافظة : طرطوس',
      'تاريخ التسجيل: 12 يناير 2024',
      'آخر نشاط: منذ 10 دقائق',
    ]);
  });
});
