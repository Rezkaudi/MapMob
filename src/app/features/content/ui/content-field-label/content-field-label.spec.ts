import { TestBed } from '@angular/core/testing';
import { ContentFieldLabel } from './content-field-label';

function render(inputs: Record<string, unknown>) {
  const fixture = TestBed.createComponent(ContentFieldLabel);
  for (const [name, value] of Object.entries(inputs)) {
    fixture.componentRef.setInput(name, value);
  }
  fixture.detectChanges();
  return fixture.nativeElement as HTMLElement;
}

describe('ContentFieldLabel', () => {
  it('writes the label with its red star after it, tied to the control', () => {
    const element = render({ text: 'عنوان الصفحة', forId: 'page-title', isRequired: true });
    const label = element.querySelector('label') as HTMLLabelElement;

    expect(label.getAttribute('for')).toBe('page-title');
    expect(label.firstChild?.textContent?.trim()).toBe('عنوان الصفحة');
    expect(label.querySelector('[aria-hidden="true"]')?.textContent).toBe('*');
  });

  it('can be a plain heading with a hint and no star', () => {
    const element = render({
      text: 'صورة عن التطبيق (البانر التعريفي)',
      hint: 'الصورة أو البانر الترويجي',
    });

    expect(element.querySelector('label')).toBeNull();
    expect(element.querySelector('[aria-hidden="true"]')).toBeNull();
    expect(element.querySelector('p')?.textContent?.trim()).toBe('الصورة أو البانر الترويجي');
  });
});
