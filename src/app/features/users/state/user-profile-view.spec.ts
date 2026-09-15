import { buildUser } from '../testing/user-fixture';
import { buildUserProfileView } from './user-profile-view';

const NOW = new Date('2026-09-15T12:00:00.000Z');

describe('buildUserProfileView', () => {
  it('describes a user who was active minutes ago as "نشط الآن"', () => {
    const view = buildUserProfileView(
      buildUser({ name: 'أحمد جمال', lastActiveAt: '2026-09-15T11:50:00.000Z' }),
      NOW,
    );

    expect(view.initials).toBe('أ ج');
    expect(view.accountTypeLabel).toBe('مسجل');
    expect(view.presence).toEqual({
      label: 'نشط الآن',
      toneClass: 'bg-status-success',
      hasDot: true,
    });
    expect(view.lastActiveLabel).toBe('منذ 10 دقائق');
    expect(view.emailLabel).toBe('ahmad@email.com');
    expect(view.phoneLabel).toBe('+966 50 123 4567');
  });

  it('drops "الآن" for an active user who has been away a while', () => {
    const view = buildUserProfileView(buildUser({ lastActiveAt: '2026-09-15T09:00:00.000Z' }), NOW);

    expect(view.presence).toEqual({ label: 'نشط', toneClass: 'bg-status-success', hasDot: false });
  });

  it('shows a suspended user in red, and says when contact details are missing', () => {
    const view = buildUserProfileView(
      buildUser({ status: 'suspended', email: null, phone: null, accountType: 'visitor' }),
      NOW,
    );

    expect(view.presence).toEqual({ label: 'موقوف', toneClass: 'bg-closed', hasDot: false });
    expect(view.accountTypeLabel).toBe('زائر');
    expect(view.emailLabel).toBe('غير متوفر');
    expect(view.phoneLabel).toBe('غير متوفر');
  });
});
