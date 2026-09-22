import { TestBed } from '@angular/core/testing';
import { CATEGORY_ICONS } from '../../models/category-icon';
import { CategoryIconPicker } from './category-icon-picker';

function render(value = 'utensils-crossed', color = '#0583EC') {
  const fixture = TestBed.createComponent(CategoryIconPicker);
  fixture.componentRef.setInput('value', value);
  fixture.componentRef.setInput('color', color);
  fixture.detectChanges();
  return fixture;
}

function buttonsOf(element: HTMLElement): HTMLButtonElement[] {
  return Array.from(element.querySelectorAll('button'));
}

function search(fixture: ReturnType<typeof render>, term: string) {
  const box = fixture.nativeElement.querySelector('input') as HTMLInputElement;
  box.value = term;
  box.dispatchEvent(new Event('input'));
  fixture.detectChanges();
}

describe('CategoryIconPicker', () => {
  it('offers the whole library and marks the current icon', () => {
    const buttons = buttonsOf(render().nativeElement);

    expect(buttons).toHaveLength(CATEGORY_ICONS.length);
    expect(buttons[0].getAttribute('aria-pressed')).toBe('true');
    expect(buttons[0].className).toContain('border-primary');
    expect(buttons[1].getAttribute('aria-pressed')).toBe('false');
    expect(buttons[1].getAttribute('aria-label')).toBe('مقاهي');
  });

  it('draws each icon with Lucide, not a bitmap', () => {
    expect(render().nativeElement.querySelectorAll('button svg').length).toBe(
      CATEGORY_ICONS.length,
    );
  });

  it('paints the picked icon in the chosen colour and leaves the rest alone', () => {
    const buttons = buttonsOf(render('coffee', '#10B981').nativeElement);
    const picked = buttons.find((button) => button.getAttribute('aria-label') === 'مقاهي');

    expect(picked?.style.color).toBe('rgb(16, 185, 129)');
    expect(buttons[0].style.color).toBe('');
  });

  it('narrows the grid by the Arabic label', () => {
    const fixture = render();

    search(fixture, 'مقاهي');

    const buttons = buttonsOf(fixture.nativeElement);
    expect(buttons).toHaveLength(1);
    expect(buttons[0].getAttribute('aria-label')).toBe('مقاهي');
  });

  it('narrows the grid by the Lucide name, so the library reads in English too', () => {
    const fixture = render();

    search(fixture, 'coffee');

    expect(buttonsOf(fixture.nativeElement)[0].getAttribute('aria-label')).toBe('مقاهي');
  });

  it('narrows the grid by an English keyword', () => {
    const fixture = render();

    search(fixture, 'pharmacy');

    expect(buttonsOf(fixture.nativeElement)[0].getAttribute('aria-label')).toBe('صيدليات');
  });

  it('says so when the search matches no icon', () => {
    const fixture = render();

    search(fixture, 'مكان غير موجود');

    expect(buttonsOf(fixture.nativeElement)).toHaveLength(0);
    expect(fixture.nativeElement.textContent).toContain('لا توجد أيقونة بهذا الاسم');
  });

  it('reports the picked icon', () => {
    const fixture = render();
    const valueChange = vi.fn();
    fixture.componentInstance.valueChange.subscribe(valueChange);

    search(fixture, 'gift');
    buttonsOf(fixture.nativeElement)[0].click();

    expect(valueChange).toHaveBeenCalledWith('gift');
  });
});
