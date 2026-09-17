import { NOTIFICATION_MOCK_RECIPIENTS, searchRecipients } from './notification-mock-recipients';

describe('searchRecipients', () => {
  it('lists users and stores separately', () => {
    expect(searchRecipients('users', '').length).toBeGreaterThan(8);
    expect(
      searchRecipients('companies', '').every((recipient) => recipient.id.startsWith('place-')),
    ).toBe(true);
  });

  it('matches the name or the phone number', () => {
    const [first] = NOTIFICATION_MOCK_RECIPIENTS.users;

    expect(searchRecipients('users', first.name.split(' ')[0])).toContain(first);
    expect(searchRecipients('users', first.phone.slice(-4))).toContain(first);
    expect(searchRecipients('users', 'لا أحد بهذا الاسم')).toEqual([]);
  });
});
