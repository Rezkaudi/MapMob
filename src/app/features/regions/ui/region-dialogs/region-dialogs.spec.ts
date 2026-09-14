import { TestBed } from '@angular/core/testing';
import { buildGovernorate } from '../../testing/region-entry-fixture';
import { RegionDialogs } from './region-dialogs';

const SAFITA = buildGovernorate({ id: 'a', name: 'صافيتا', status: 'suspended' });

function render(inputs: Record<string, unknown>) {
  const fixture = TestBed.createComponent(RegionDialogs);
  fixture.componentRef.setInput('kind', 'area');
  for (const [name, value] of Object.entries(inputs)) {
    fixture.componentRef.setInput(name, value);
  }
  fixture.detectChanges();
  return fixture;
}

describe('RegionDialogs', () => {
  it('shows nothing without a request', () => {
    expect(render({ request: null }).nativeElement.querySelector('[role="dialog"]')).toBeNull();
  });

  it('opens the add form with the locked governorate', () => {
    const element = render({
      request: { type: 'form', mode: 'create', entry: null },
      governorateName: 'طرطوس',
    }).nativeElement as HTMLElement;

    expect(element.querySelector('h2')?.textContent?.trim()).toBe('إضافة منطقة');
    expect(
      (element.querySelector('[data-testid="locked-governorate"]') as HTMLInputElement).value,
    ).toBe('طرطوس');
  });

  it('fills the edit form from the entry', () => {
    const element = render({ request: { type: 'form', mode: 'edit', entry: SAFITA } })
      .nativeElement as HTMLElement;

    expect((element.querySelector('[data-testid="region-name"]') as HTMLInputElement).value).toBe(
      'صافيتا',
    );
    expect(
      (element.querySelector('[data-testid="region-status"]') as HTMLSelectElement).value,
    ).toBe('suspended');
  });

  it('asks to confirm with the entry name, and passes the answer on', () => {
    const fixture = render({ request: { type: 'confirm', action: 'activate', entry: SAFITA } });
    const confirmed = vi.fn();
    fixture.componentInstance.confirmed.subscribe(confirmed);
    const element = fixture.nativeElement as HTMLElement;

    expect(element.textContent).toContain('هل تريد تفعيل منطقة صافيتا؟');
    Array.from(element.querySelectorAll('button'))
      .find((button) => button.textContent?.trim() === 'تفعيل المنطقة')
      ?.click();

    expect(confirmed).toHaveBeenCalledOnce();
  });
});
