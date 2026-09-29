import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { PlaceFieldControl } from './place-field-control';

@Component({
  imports: [PlaceFieldControl],
  template: `
    <input data-role="name" appPlaceFieldControl fieldTone="strong" />
    <input data-role="phone" appPlaceFieldControl [isLatin]="true" />
    <select data-role="city" appPlaceFieldControl></select>
    <textarea data-role="description" appPlaceFieldControl></textarea>
  `,
})
class HostComponent {}

function render() {
  const fixture = TestBed.createComponent(HostComponent);
  fixture.detectChanges();
  return (role: string) =>
    fixture.nativeElement.querySelector(`[data-role="${role}"]`) as HTMLElement;
}

describe('PlaceFieldControl', () => {
  it('draws the frame field: 46px tall, 4px corners, 14px text', () => {
    const name = render()('name');

    expect(name.classList).toContain('h-[46px]');
    expect(name.classList).toContain('rounded');
    expect(name.classList).toContain('text-[14px]');
  });

  it('uses the dark #64748B border when strong and the soft #C0C7D5 one otherwise', () => {
    const find = render();

    expect(find('name').classList).toContain('border-[#64748b]');
    expect(find('phone').classList).toContain('border-[#c0c7d5]');
  });

  it('writes Arabic from the right and Latin fields left to right, from the left edge', () => {
    const find = render();

    expect(find('name').classList).toContain('text-right');
    expect(find('name').getAttribute('dir')).toBeNull();
    expect(find('phone').classList).toContain('text-left');
    expect(find('phone').getAttribute('dir')).toBe('ltr');
  });

  it('leaves room on the left of a select for its chevron', () => {
    const city = render()('city');

    expect(city.classList).toContain('appearance-none');
    expect(city.classList).toContain('pl-10');
  });

  it('greys a select out while its empty prompt is picked, like a placeholder', () => {
    expect(render()('city').classList).toContain("has-[option[value='']:checked]:text-[#94a3b8]");
  });

  it('lets a text area grow from 120px instead of fixing its height', () => {
    const description = render()('description');

    expect(description.classList).not.toContain('h-[46px]');
    expect(description.classList).toContain('min-h-[120px]');
  });

  it('turns the border red once a field is touched and still invalid', () => {
    expect(render()('name').classList).toContain('[&.ng-touched.ng-invalid]:border-closed');
  });
});
