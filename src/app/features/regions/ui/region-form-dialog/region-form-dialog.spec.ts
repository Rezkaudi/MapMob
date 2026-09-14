import { TestBed } from '@angular/core/testing';
import { buildFormCopy } from '../region-dialog-copy';
import { RegionFormDialog } from './region-form-dialog';

function render(inputs: Record<string, unknown> = {}) {
  const fixture = TestBed.createComponent(RegionFormDialog);
  fixture.componentRef.setInput('copy', buildFormCopy('governorate', 'edit'));
  for (const [name, value] of Object.entries(inputs)) {
    fixture.componentRef.setInput(name, value);
  }
  fixture.detectChanges();
  return fixture;
}

function nameInput(element: HTMLElement): HTMLInputElement {
  return element.querySelector('[data-testid="region-name"]') as HTMLInputElement;
}

function statusSelect(element: HTMLElement): HTMLSelectElement {
  return element.querySelector('[data-testid="region-status"]') as HTMLSelectElement;
}

function submitButton(element: HTMLElement): HTMLButtonElement {
  return element.querySelector('[data-testid="region-submit"]') as HTMLButtonElement;
}

describe('RegionFormDialog', () => {
  it('shows the title, description, labels and the action names', () => {
    const element = render().nativeElement as HTMLElement;

    expect(element.querySelector('h2')?.textContent?.trim()).toBe('تعديل المحافظة');
    expect(element.textContent).toContain('تعديل بيانات المحافظة وإدارة حالتها');
    expect(element.textContent).toContain('اسم المحافظة');
    expect(element.textContent).toContain('الحالة');
    expect(submitButton(element).textContent?.trim()).toBe('حفظ التغييرات');
  });

  it('starts from the given name and status', () => {
    const element = render({ initialName: 'طرطوس', initialStatus: 'suspended' })
      .nativeElement as HTMLElement;

    expect(nameInput(element).value).toBe('طرطوس');
    expect(statusSelect(element).value).toBe('suspended');
    expect(Array.from(statusSelect(element).options, (option) => option.text.trim())).toEqual([
      'نشطة',
      'معطلة',
    ]);
  });

  it('sends the trimmed name and the picked status', () => {
    const fixture = render();
    const submitted = vi.fn();
    fixture.componentInstance.submitted.subscribe(submitted);
    const element = fixture.nativeElement as HTMLElement;

    nameInput(element).value = '  حماة  ';
    nameInput(element).dispatchEvent(new Event('input'));
    statusSelect(element).value = 'suspended';
    statusSelect(element).dispatchEvent(new Event('change'));
    fixture.detectChanges();
    submitButton(element).click();

    expect(submitted).toHaveBeenCalledWith({ name: 'حماة', status: 'suspended' });
  });

  it('will not send an empty name', () => {
    const fixture = render({ initialName: '   ' });
    const submitted = vi.fn();
    fixture.componentInstance.submitted.subscribe(submitted);
    const element = fixture.nativeElement as HTMLElement;

    expect(submitButton(element).disabled).toBe(true);
    element.querySelector('form')?.dispatchEvent(new Event('submit'));
    expect(submitted).not.toHaveBeenCalled();
  });

  it('locks the submit button while saving', () => {
    const element = render({ initialName: 'طرطوس', isBusy: true }).nativeElement as HTMLElement;

    expect(submitButton(element).disabled).toBe(true);
  });

  it('shows the governorate as a locked field when adding an area', () => {
    const element = render({
      copy: buildFormCopy('area', 'create'),
      lockedGovernorateName: 'طرطوس',
    }).nativeElement as HTMLElement;

    const locked = element.querySelector('[data-testid="locked-governorate"]') as HTMLInputElement;
    expect(locked.value).toBe('طرطوس');
    expect(locked.readOnly).toBe(true);
    expect(element.textContent).toContain('اسم المنطقة');
  });

  it('has no locked field for a governorate', () => {
    const element = render().nativeElement as HTMLElement;

    expect(element.querySelector('[data-testid="locked-governorate"]')).toBeNull();
  });

  it('reports cancel from the close button, the cancel button and Escape', () => {
    const fixture = render();
    const cancelled = vi.fn();
    fixture.componentInstance.cancelled.subscribe(cancelled);
    const element = fixture.nativeElement as HTMLElement;

    (element.querySelector('[data-testid="region-close"]') as HTMLButtonElement).click();
    (element.querySelector('[data-testid="region-cancel"]') as HTMLButtonElement).click();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

    expect(cancelled).toHaveBeenCalledTimes(3);
  });
});
