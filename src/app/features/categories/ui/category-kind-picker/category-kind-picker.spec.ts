import { TestBed } from '@angular/core/testing';
import { CategoryKindPicker } from './category-kind-picker';

function render(value: 'main' | 'sub') {
  const fixture = TestBed.createComponent(CategoryKindPicker);
  fixture.componentRef.setInput('value', value);
  fixture.detectChanges();
  return fixture;
}

function radiosOf(element: HTMLElement): HTMLInputElement[] {
  return Array.from(element.querySelectorAll('input[type="radio"]'));
}

describe('CategoryKindPicker', () => {
  it('offers main then sub, and checks the current kind', () => {
    const element = render('sub').nativeElement as HTMLElement;
    const labels = Array.from(element.querySelectorAll('label'), (label) =>
      label.textContent?.trim(),
    );
    const [main, sub] = radiosOf(element);

    expect(labels).toEqual(['تصنيف رئيسي', 'تصنيف فرعي']);
    expect(main.checked).toBe(false);
    expect(sub.checked).toBe(true);
  });

  it('draws the checked card with the blue 2px border', () => {
    const [mainCard, subCard] = Array.from(
      (render('main').nativeElement as HTMLElement).querySelectorAll('label'),
    );

    expect(mainCard.className).toContain('border-primary');
    expect(subCard.className).not.toContain('border-primary');
  });

  it('reports the picked kind', () => {
    const fixture = render('main');
    const valueChange = vi.fn();
    fixture.componentInstance.valueChange.subscribe(valueChange);

    radiosOf(fixture.nativeElement)[1].click();

    expect(valueChange).toHaveBeenCalledWith('sub');
  });
});
