import { TestBed } from '@angular/core/testing';
import { ClipboardWriter } from '../code-block/clipboard-writer';
import { buildEndpoint, buildFeature } from '../../testing/api-docs-fixture';
import { EndpointCard } from './endpoint-card';

const endpoint = buildEndpoint({
  id: 'places-status',
  method: 'PATCH',
  path: '/places/{id}/status',
  summary: 'Toggle one place.',
  body: {
    contentType: 'application/json',
    fields: [
      { name: 'status', type: 'enum: active | suspended', isRequired: true, description: '' },
    ],
    example: { status: 'suspended' },
  },
  response: { status: 200, description: 'The updated place.', example: { id: '12' } },
  notes: ['Works today.'],
});

function render(isOpen: boolean) {
  TestBed.configureTestingModule({
    providers: [{ provide: ClipboardWriter, useValue: { write: vi.fn() } }],
  });
  const fixture = TestBed.createComponent(EndpointCard);
  fixture.componentRef.setInput('feature', buildFeature());
  fixture.componentRef.setInput('endpoint', endpoint);
  fixture.componentRef.setInput('isOpen', isOpen);
  fixture.detectChanges();
  return fixture;
}

describe('EndpointCard', () => {
  it('shows the method, path and summary in its header', () => {
    const header: HTMLElement = render(false).nativeElement.querySelector('button');

    expect(header.textContent).toContain('PATCH');
    expect(header.textContent).toContain('/places/{id}/status');
    expect(header.textContent).toContain('Toggle one place.');
    expect(header.getAttribute('aria-expanded')).toBe('false');
  });

  it('carries its anchor id', () => {
    expect(render(false).nativeElement.querySelector('#places-status')).toBeTruthy();
  });

  it('hides the details while closed', () => {
    expect(render(false).nativeElement.querySelector('[data-endpoint-details]')).toBeNull();
  });

  it('asks to toggle when the header is clicked', () => {
    const fixture = render(false);
    const toggled = vi.fn();
    fixture.componentInstance.toggle.subscribe(toggled);

    fixture.nativeElement.querySelector('button').click();

    expect(toggled).toHaveBeenCalledWith('places-status');
  });

  it('shows the permission, bodies, errors, notes and cURL when open', () => {
    const text = (render(true).nativeElement as HTMLElement).textContent ?? '';

    expect(text).toContain('places:edit');
    expect(text).toContain('application/json');
    expect(text).toContain('"status": "suspended"');
    expect(text).toContain('200');
    expect(text).toContain('The updated place.');
    expect(text).toContain('404');
    expect(text).toContain('422');
    expect(text).toContain('Works today.');
    expect(text).toContain('curl -X PATCH');
  });
});
