import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { UserRepository } from '../../data/user.repository';
import { UserList } from './user-list';

describe('UserList', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: UserRepository,
          useValue: {
            getUsers: () =>
              of({
                items: [
                  {
                    id: 'user-1',
                    name: 'أحمد جمال',
                    email: 'ahmad@email.com',
                    accountType: 'مسجل',
                    registeredAt: '2024-01-12T00:00:00.000Z',
                    lastActiveLabel: 'منذ يومين',
                    status: 'active',
                  },
                ],
                totalCount: 1,
              }),
            getSummary: () =>
              of({
                newUserCount: 340,
                verifiedUserCount: 427,
                activeUserCount: 2673,
                totalUserCount: 3000,
              }),
          },
        },
      ],
    });
  });

  it('renders the title, summary and user rows', () => {
    const fixture = TestBed.createComponent(UserList);
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('المستخدمين');
    expect(text).toContain('أحمد جمال');
    expect(text).toContain('3,000');
  });
});
