import { TestBed } from '@angular/core/testing';
import { OptionCard } from './option-card';

function render(isSelected: boolean, description = 'يشمل هذا العرض كامل قائمة المنتجات') {
  const fixture = TestBed.createComponent(OptionCard);
  fixture.componentRef.setInput('title', 'جميع المنتجات والخدمات');
  fixture.componentRef.setInput('description', description);
  fixture.componentRef.setInput('isSelected', isSelected);
  fixture.detectChanges();
  return fixture;
}

function cardOf(fixture: ReturnType<typeof render>): HTMLButtonElement {
  return (fixture.nativeElement as HTMLElement).querySelector(
    '[role="radio"]',
  ) as HTMLButtonElement;
}

describe('OptionCard', () => {
  it('shows the title and description as a radio', () => {
    const card = cardOf(render(false));

    expect(card.textContent).toContain('جميع المنتجات والخدمات');
    expect(card.textContent).toContain('يشمل هذا العرض كامل قائمة المنتجات');
    expect(card.getAttribute('aria-checked')).toBe('false');
    expect(card.className).toContain('border-text-secondary');
  });

  it('draws the picked card with a 2px blue frame and a filled dot', () => {
    const card = cardOf(render(true));

    expect(card.getAttribute('aria-checked')).toBe('true');
    expect(card.className).toContain('border-2');
    expect(card.querySelector('[data-role="radio-dot"]')?.className).toContain('bg-primary');
  });

  it('shrinks to one line without a description, and reports a pick', () => {
    const fixture = render(false, '');
    const picked = vi.fn();
    fixture.componentInstance.picked.subscribe(picked);

    expect(cardOf(fixture).querySelector('[data-role="description"]')).toBeNull();
    cardOf(fixture).click();
    expect(picked).toHaveBeenCalled();
  });

  it("takes the offer form's 70px height, or the ad form's 68px, in either state", () => {
    const fixture = render(false);
    const card = () => cardOf(fixture);
    expect(card().className).toContain('py-[13px]');

    fixture.componentRef.setInput('size', 'roomy');
    fixture.detectChanges();
    expect(card().className).toContain('py-[14px]');

    fixture.componentRef.setInput('isSelected', true);
    fixture.detectChanges();
    expect(card().className).toContain('py-[13px]');
  });
});
