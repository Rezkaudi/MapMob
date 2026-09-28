import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MERCHANT_QUICK_ACTIONS } from '../../state/quick-actions';
import { QuickActionCard } from './quick-action-card';

function render(index: number) {
  TestBed.configureTestingModule({ providers: [provideRouter([])] });
  const fixture = TestBed.createComponent(QuickActionCard);
  fixture.componentRef.setInput('action', MERCHANT_QUICK_ACTIONS[index]);
  fixture.detectChanges();
  return fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
}

describe('QuickActionCard', () => {
  it('is one link to the page it names', () => {
    const card = render(1);

    expect(card.getAttribute('href')).toBe('/merchant/offers');
    expect(card.querySelector('h3')!.textContent!.trim()).toBe('إضافة عرض ترويجي');
    expect(card.querySelector('p')!.textContent!.trim()).toBe(
      'أنشئ عرضاً وتخفيضات لجذب المزيد من الزوار',
    );
  });

  it('writes the icon tile before the arrow, so RTL puts the tile right and the arrow left', () => {
    const card = render(1);

    const topRow = card.firstElementChild!;
    expect(topRow.children[0].classList).toContain('bg-accent');
    expect(topRow.children[1].getAttribute('name')).toBe('arrow-right-small');
  });

  it('draws the highlighted card in the blue gradient with white text', () => {
    const card = render(0);

    expect(card.className).toContain(
      'bg-[linear-gradient(180deg,#0583ec_0%,#0030a8_50%,#001e8f_100%)]',
    );
    expect(card.querySelector('h3')!.classList).toContain('text-white');
  });

  it('draws the other cards white', () => {
    expect(render(3).classList).toContain('bg-surface');
  });

  it('stacks from the top, so a one-line description does not push the title down', () => {
    const card = render(0);

    expect(card.classList).not.toContain('justify-between');
    expect(card.lastElementChild!.classList).toContain('pt-6');
  });
});
