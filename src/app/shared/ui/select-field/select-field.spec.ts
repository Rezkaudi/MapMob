import { TestBed } from '@angular/core/testing';
import { SelectField } from './select-field';

describe('SelectField', () => {
  it('shows the placeholder and every option', () => {
    const fixture = TestBed.createComponent(SelectField);
    fixture.componentRef.setInput('placeholder', 'الباقة');
    fixture.componentRef.setInput('options', [{ value: 'free', label: 'مجانية' }]);
    fixture.detectChanges();

    const select: HTMLSelectElement = fixture.nativeElement.querySelector('select');
    expect(select.options[0].textContent?.trim()).toBe('الباقة');
    expect(select.options[1].textContent?.trim()).toBe('مجانية');
  });

  it('emits the picked value, and null for the placeholder row', () => {
    const fixture = TestBed.createComponent(SelectField);
    fixture.componentRef.setInput('placeholder', 'الباقة');
    fixture.componentRef.setInput('options', [{ value: 'free', label: 'مجانية' }]);
    const emitted: (string | null)[] = [];
    fixture.componentInstance.valueChange.subscribe((value) => emitted.push(value));
    fixture.detectChanges();

    const select: HTMLSelectElement = fixture.nativeElement.querySelector('select');
    select.value = 'free';
    select.dispatchEvent(new Event('change'));
    select.value = '';
    select.dispatchEvent(new Event('change'));

    expect(emitted).toEqual(['free', null]);
  });

  it('fades the text and chevron to 60% when muted, as the category filters draw them', () => {
    const fixture = TestBed.createComponent(SelectField);
    fixture.componentRef.setInput('options', []);
    fixture.componentRef.setInput('isMuted', true);
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('select')?.className).toContain('text-text-primary/60');
    expect(element.querySelector('app-icon')?.className).toContain('text-text-primary/60');
  });

  it('keeps full strength by default', () => {
    const fixture = TestBed.createComponent(SelectField);
    fixture.componentRef.setInput('options', []);
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('select')?.className).not.toContain('/60');
  });
});
