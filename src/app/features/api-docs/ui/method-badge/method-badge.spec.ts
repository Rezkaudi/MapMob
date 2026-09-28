import { TestBed } from '@angular/core/testing';
import { HttpMethod } from '../../models/http-method';
import { MethodBadge } from './method-badge';

function render(method: HttpMethod): HTMLElement {
  const fixture = TestBed.createComponent(MethodBadge);
  fixture.componentRef.setInput('method', method);
  fixture.detectChanges();
  return fixture.nativeElement.querySelector('span');
}

describe('MethodBadge', () => {
  it('shows the method', () => {
    expect(render('PATCH').textContent?.trim()).toBe('PATCH');
  });

  it('gives each method its own colour', () => {
    expect(render('GET').className).not.toBe(render('DELETE').className);
  });
});
