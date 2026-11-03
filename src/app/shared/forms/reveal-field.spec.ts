import { revealField } from './reveal-field';

describe('revealField', () => {
  afterEach(() => document.body.replaceChildren());

  function attach(html: string): HTMLElement {
    const host = document.createElement('div');
    host.innerHTML = html;
    document.body.append(host);
    return host;
  }

  it('scrolls the field to the middle of the screen and focuses it', () => {
    const input = attach('<input id="name" />').querySelector('input')!;
    input.scrollIntoView = vi.fn();

    revealField(input);

    expect(input.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'center' });
    expect(document.activeElement).toBe(input);
  });

  it('focuses the first control inside a custom field', () => {
    const field = attach(
      '<app-picker><span>label</span><button id="pick">pick</button></app-picker>',
    ).querySelector('app-picker') as HTMLElement;
    field.scrollIntoView = vi.fn();

    revealField(field);

    expect(document.activeElement?.id).toBe('pick');
  });
});
