import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NEVER, of } from 'rxjs';
import { FileSaver } from '../../../../shared/files/file-saver';
import { UserRepository } from '../../data/user.repository';
import { buildUser } from '../../testing/user-fixture';
import { UserList } from './user-list';

const SUMMARY = {
  totalUserCount: 3000,
  activeUserCount: 2673,
  suspendedUserCount: 427,
  newUserCount: 340,
};

function render(repository: Partial<UserRepository>) {
  const fileSaver = { save: vi.fn() };
  TestBed.configureTestingModule({
    providers: [
      provideRouter([]),
      { provide: UserRepository, useValue: repository },
      { provide: FileSaver, useValue: fileSaver },
    ],
  });
  const fixture = TestBed.createComponent(UserList);
  fixture.detectChanges();
  return { fixture, fileSaver };
}

function buttonNamed(element: HTMLElement, label: string): HTMLButtonElement {
  return Array.from(element.querySelectorAll('button')).find(
    (button) => button.textContent?.trim() === label,
  ) as HTMLButtonElement;
}

describe('UserList', () => {
  it('shows the header, the stat cards, the table and the paging', () => {
    const { fixture } = render({
      getUsers: () => of({ items: [buildUser()], totalCount: 3000 }),
      getSummary: () => of(SUMMARY),
    });
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('h1')?.textContent?.trim()).toBe('المستخدمين');
    expect(element.textContent).toContain('إدارة ومتابعة مستخدمي المنصة.');
    expect(element.textContent).toContain('المستخدمون الموقوفون');
    expect(element.textContent).toContain('340+');
    expect(element.textContent).toContain('أحمد جمال');
    expect(element.textContent).toContain('عرض 1- 6 من 3000 مستخدم');
  });

  it('draws placeholders while loading', () => {
    const { fixture } = render({ getUsers: () => NEVER, getSummary: () => NEVER });

    expect(fixture.nativeElement.querySelector('tbody[app-table-skeleton]')).toBeTruthy();
    expect(fixture.nativeElement.querySelectorAll('app-skeleton').length).toBeGreaterThan(0);
  });

  it('opens the suspend dialog from the row menu', () => {
    const { fixture } = render({
      getUsers: () => of({ items: [buildUser()], totalCount: 1 }),
      getSummary: () => of(SUMMARY),
    });
    const element = fixture.nativeElement as HTMLElement;

    (element.querySelector('button[aria-haspopup]') as HTMLButtonElement).click();
    fixture.detectChanges();
    buttonNamed(element, 'تغيير الحالة').click();
    fixture.detectChanges();

    expect(element.querySelector('[role="dialog"] h2')?.textContent?.trim()).toBe('إيقاف الحساب');
  });

  it('saves the export as a dated CSV file', async () => {
    const file = new Blob(['csv']);
    const { fixture, fileSaver } = render({
      getUsers: () => of({ items: [], totalCount: 0 }),
      getSummary: () => of(SUMMARY),
      exportUsers: () => of(file),
    });

    buttonNamed(fixture.nativeElement, 'تصدير').click();
    await fixture.whenStable();

    expect(fileSaver.save).toHaveBeenCalledWith(
      file,
      expect.stringMatching(/^users-\d{4}-\d{2}-\d{2}\.csv$/),
    );
  });
});
