import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CLOCK } from '../../../../core/config/clock';
import { buildUser } from '../../testing/user-fixture';
import { UserTable } from './user-table';

const NOW = new Date('2024-01-14T12:00:00.000Z');
const AHMAD = buildUser({
  id: 'user-1',
  lastActiveAt: '2024-01-12T12:00:00.000Z',
});
const SARA = buildUser({
  id: 'user-2',
  name: 'سارة محمود',
  email: null,
  phone: '+966 50 000 1111',
  accountType: 'visitor',
  status: 'suspended',
});

function render(inputs: Record<string, unknown> = {}) {
  TestBed.configureTestingModule({
    providers: [provideRouter([]), { provide: CLOCK, useValue: () => NOW }],
  });
  const fixture = TestBed.createComponent(UserTable);
  fixture.componentRef.setInput('entries', [AHMAD, SARA]);
  for (const [name, value] of Object.entries(inputs)) {
    fixture.componentRef.setInput(name, value);
  }
  fixture.detectChanges();
  return fixture;
}

function cellTexts(row: Element): string[] {
  return Array.from(row.querySelectorAll('td'), (cell) => cell.textContent?.trim() ?? '');
}

describe('UserTable', () => {
  it('draws the design columns in order', () => {
    const headers = Array.from(
      render().nativeElement.querySelectorAll('th') as NodeListOf<HTMLElement>,
      (header) => header.textContent?.trim(),
    );

    expect(headers).toEqual([
      '',
      'اسم المستخدم',
      'البريد/الهاتف',
      'نوع الحساب',
      'تاريخ التسجيل',
      'آخر نشاط',
      'الحالة',
      'الإجراء',
    ]);
  });

  it('writes each user the way the design does', () => {
    const rows = render().nativeElement.querySelectorAll('tbody tr');

    expect(cellTexts(rows[0]).slice(1, 7)).toEqual([
      'أحمد جمال',
      'ahmad@email.com',
      'مسجل',
      '١٢ يناير ٢٠٢٤',
      'منذ يومين',
      'نشط',
    ]);
    expect(cellTexts(rows[1]).slice(1, 7)).toEqual([
      'سارة محمود',
      '+966 50 000 1111',
      'زائر',
      '١٢ يناير ٢٠٢٤',
      'منذ 12 ساعة',
      'موقوف',
    ]);
  });

  it('underlines a contact, but not the dash of a user without one', () => {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: CLOCK, useValue: () => NOW }],
    });
    const fixture = TestBed.createComponent(UserTable);
    fixture.componentRef.setInput('entries', [
      AHMAD,
      buildUser({ id: 'u3', email: null, phone: null }),
    ]);
    fixture.detectChanges();
    const contacts = Array.from(
      fixture.nativeElement.querySelectorAll(
        'tbody tr td:nth-child(3) span',
      ) as NodeListOf<HTMLElement>,
    );

    expect(contacts.map((contact) => contact.classList.contains('underline'))).toEqual([
      true,
      false,
    ]);
    expect(contacts[1].textContent?.trim()).toBe('—');
  });

  it('links each name to the user detail page', () => {
    const link = render().nativeElement.querySelector('tbody a') as HTMLAnchorElement;

    expect(link.getAttribute('href')).toBe('/users/user-1');
  });

  it('reports ticks, and marks the ticked rows', () => {
    const fixture = render({ selectedIdSet: new Set(['user-2']) });
    const rowToggle = vi.fn();
    const allToggle = vi.fn();
    fixture.componentInstance.rowToggle.subscribe(rowToggle);
    fixture.componentInstance.allToggle.subscribe(allToggle);
    const boxes = fixture.nativeElement.querySelectorAll('input[type="checkbox"]');

    boxes[0].click();
    boxes[1].click();

    expect(allToggle).toHaveBeenCalledOnce();
    expect(rowToggle).toHaveBeenCalledWith('user-1');
    expect(boxes[2].checked).toBe(true);
  });

  it('reports the row menu picks with the user', () => {
    const fixture = render();
    const view = vi.fn();
    const statusChange = vi.fn();
    const remove = vi.fn();
    fixture.componentInstance.view.subscribe(view);
    fixture.componentInstance.statusChange.subscribe(statusChange);
    fixture.componentInstance.remove.subscribe(remove);
    const openMenu = () => {
      (fixture.nativeElement.querySelector('button[aria-haspopup]') as HTMLButtonElement).click();
      fixture.detectChanges();
      return Array.from(
        fixture.nativeElement.querySelectorAll('[data-testid="action-menu-panel"] button'),
      ) as HTMLButtonElement[];
    };

    openMenu()[0].click();
    openMenu()[1].click();
    openMenu()[2].click();

    expect(view).toHaveBeenCalledWith(AHMAD);
    expect(statusChange).toHaveBeenCalledWith(AHMAD);
    expect(remove).toHaveBeenCalledWith(AHMAD);
  });

  it('draws placeholder rows while loading', () => {
    const fixture = render({ isLoading: true });

    expect(fixture.nativeElement.querySelector('tbody[app-table-skeleton]')).toBeTruthy();
  });

  it('shows a message when there are no users', () => {
    const fixture = render({ entries: [], hasNoResults: true, emptyMessage: 'لا يوجد مستخدمون' });

    expect(fixture.nativeElement.textContent).toContain('لا يوجد مستخدمون');
  });
});
