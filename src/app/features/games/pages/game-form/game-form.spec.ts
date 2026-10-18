import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { CLOCK } from '../../../../core/config/clock';
import { GameRepository } from '../../data/game.repository';
import { GameDraft } from '../../models/game-draft';
import { buildGame, buildGameDetail } from '../../testing/game-fixture';
import { GameForm } from './game-form';

const NOW = new Date('2026-10-11T09:00:00.000Z');

function render(id?: string) {
  const repository: Partial<GameRepository> = {
    getGameDetail: vi.fn(() => of(buildGameDetail())),
    createGame: vi.fn(() => of(buildGame())),
    updateGame: vi.fn(() => of(buildGame())),
  };
  TestBed.configureTestingModule({
    providers: [
      provideRouter([]),
      { provide: GameRepository, useValue: repository },
      { provide: CLOCK, useValue: () => NOW },
    ],
  });
  const fixture = TestBed.createComponent(GameForm);
  if (id) {
    fixture.componentRef.setInput('id', id);
  }
  fixture.detectChanges();
  const router = TestBed.inject(Router);
  vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
  const element: HTMLElement = fixture.nativeElement;
  const type = (selector: string, value: string) => {
    const field = element.querySelector(selector) as HTMLInputElement | HTMLSelectElement;
    field.value = value;
    field.dispatchEvent(new Event(field.tagName === 'SELECT' ? 'change' : 'input'));
  };
  const fillRequired = () => {
    type('#game-name', 'الأكثرية والأقلية');
    type('#game-starts-on', '2026-10-15');
    type('#game-start-time', '18:00');
    type('#game-question-0-text', 'ما المشروب؟');
    type('#game-question-0-first', 'القهوة');
    type('#game-question-0-second', 'الشاي');
    fixture.detectChanges();
  };
  return { fixture, element, repository, router, fillRequired, type };
}

describe('GameForm', () => {
  it('draws the three cards of the add frame', () => {
    const { element } = render();
    expect(element.querySelector('h1')?.textContent?.trim()).toBe('إنشاء لعبة جديدة');
    expect(Array.from(element.querySelectorAll('h2')).map((h2) => h2.textContent?.trim())).toEqual([
      'المعلومات العامة للعبة',
      'الأسئلة والجولات',
      'إعدادات الجائزة المرصودة',
    ]);
  });

  it('adds and removes questions, keeping at least one', () => {
    const { fixture, element } = render();
    const questions = () => element.querySelectorAll('app-game-question-fields');
    expect(element.querySelector('[data-role="remove-question"]')).toBeNull();

    element.querySelector<HTMLButtonElement>('[data-role="add-question"]')?.click();
    fixture.detectChanges();
    expect(questions()).toHaveLength(2);
    expect(questions()[1].textContent).toContain('السؤال 2');

    element.querySelector<HTMLButtonElement>('[data-role="remove-question"]')?.click();
    fixture.detectChanges();
    expect(questions()).toHaveLength(1);
  });

  it('asks who gives the prize only for a voucher', () => {
    const { fixture, element, type } = render();
    expect(element.querySelector('#game-sponsor')).toBeNull();
    type('#game-prize-kind', 'voucher');
    fixture.detectChanges();
    expect(element.querySelector('#game-sponsor')).not.toBeNull();
  });

  it('shows the errors and saves nothing while required fields are empty', () => {
    const { fixture, element, repository } = render();
    element.querySelector<HTMLButtonElement>('button[type="submit"]')?.click();
    fixture.detectChanges();
    expect(repository.createGame).not.toHaveBeenCalled();
    expect(element.textContent).toContain('أدخل اسم اللعبة');
  });

  it('creates a scheduled game and goes back to the list', async () => {
    const { fixture, element, repository, router, fillRequired } = render();
    fillRequired();

    element.querySelector<HTMLButtonElement>('button[type="submit"]')?.click();
    await fixture.whenStable();

    const draft = vi.mocked(repository.createGame!).mock.calls[0][0] as GameDraft;
    expect(draft.status).toBe('scheduled');
    expect(draft.startsAt).toBe('2026-10-15T18:00:00+03:00');
    expect(draft.questions).toEqual([{ text: 'ما المشروب؟', options: ['القهوة', 'الشاي'] }]);
    expect(router.navigateByUrl).toHaveBeenCalledWith('/admin/games');
  });

  it('refuses to publish a game whose start has passed', () => {
    const { fixture, element, repository, fillRequired, type } = render();
    fillRequired();
    type('#game-starts-on', '2026-10-01');
    element.querySelector<HTMLButtonElement>('button[type="submit"]')?.click();
    fixture.detectChanges();
    expect(repository.createGame).not.toHaveBeenCalled();
    expect(element.textContent).toContain('اختر موعداً لم يمضِ بعد');
  });

  it('saves a draft', async () => {
    const { fixture, element, repository, fillRequired } = render();
    fillRequired();
    const draftButton = Array.from(element.querySelectorAll('button')).find((button) =>
      button.textContent?.includes('حفظ كمسودة'),
    );
    draftButton?.click();
    await fixture.whenStable();
    expect(vi.mocked(repository.createGame!).mock.calls[0][0].status).toBe('draft');
  });

  it('fills the edit page from the saved game and updates it', async () => {
    const { fixture, element, repository } = render('game-104');
    expect(element.querySelector('h1')?.textContent?.trim()).toBe('تعديل اللعبة');
    expect((element.querySelector('#game-name') as HTMLInputElement).value).toBe(
      'الأكثرية والأقلية',
    );
    expect((element.querySelector('#game-start-time') as HTMLInputElement).value).toBe('18:00');

    element.querySelector<HTMLButtonElement>('button[type="submit"]')?.click();
    await fixture.whenStable();

    expect(repository.updateGame).toHaveBeenCalledWith(
      'game-104',
      expect.objectContaining({ status: 'scheduled' }),
    );
  });
});
