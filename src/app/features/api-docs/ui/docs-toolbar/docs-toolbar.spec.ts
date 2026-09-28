import { TestBed } from '@angular/core/testing';
import { DocsToolbar } from './docs-toolbar';

function render() {
  const fixture = TestBed.createComponent(DocsToolbar);
  fixture.componentRef.setInput('search', '');
  fixture.componentRef.setInput('methodFilter', 'DELETE');
  fixture.componentRef.setInput('visibleCount', 104);
  fixture.detectChanges();
  return fixture;
}

describe('DocsToolbar', () => {
  it('sends the typed search', () => {
    const fixture = render();
    const searched = vi.fn();
    fixture.componentInstance.searchChange.subscribe(searched);
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input[type="search"]');

    input.value = '/places';
    input.dispatchEvent(new Event('input'));

    expect(searched).toHaveBeenCalledWith('/places');
  });

  it('marks the picked method chip and sends a new pick', () => {
    const fixture = render();
    const picked = vi.fn();
    fixture.componentInstance.methodFilterChange.subscribe(picked);
    const chips: HTMLButtonElement[] = [
      ...fixture.nativeElement.querySelectorAll('[data-method-chip]'),
    ];

    expect(chips.map((chip) => chip.textContent?.trim())).toEqual([
      'All',
      'GET',
      'POST',
      'PUT',
      'PATCH',
      'DELETE',
    ]);
    expect(chips[5].getAttribute('aria-pressed')).toBe('true');

    chips[0].click();
    expect(picked).toHaveBeenCalledWith(null);
  });

  it('says how many endpoints show', () => {
    expect(render().nativeElement.textContent).toContain('104 endpoints');
  });

  it('asks to open and to close every endpoint', () => {
    const fixture = render();
    const opened = vi.fn();
    const closed = vi.fn();
    fixture.componentInstance.openAll.subscribe(opened);
    fixture.componentInstance.closeAll.subscribe(closed);

    fixture.nativeElement.querySelector('[data-open-all]').click();
    fixture.nativeElement.querySelector('[data-close-all]').click();

    expect(opened).toHaveBeenCalled();
    expect(closed).toHaveBeenCalled();
  });
});
