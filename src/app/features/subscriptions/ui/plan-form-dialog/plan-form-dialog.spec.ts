import { TestBed } from '@angular/core/testing';
import { MOCK_PLANS } from '../../data/plan-mock-samples';
import { PackagePlan } from '../../models/package-plan';
import { PlanDraft } from '../../models/plan-draft';
import { PlanFormDialog } from './plan-form-dialog';
import { tryEveryWayOut } from '../../../../shared/testing/try-every-way-out';

const basic = MOCK_PLANS.find((plan) => plan.id === 'basic') as PackagePlan;
const featured = MOCK_PLANS.find((plan) => plan.id === 'featured') as PackagePlan;

function render(plan: PackagePlan = basic) {
  const fixture = TestBed.createComponent(PlanFormDialog);
  fixture.componentRef.setInput('plan', plan);
  fixture.detectChanges();
  return fixture;
}

function element(fixture: ReturnType<typeof render>): HTMLElement {
  return fixture.nativeElement as HTMLElement;
}

describe('PlanFormDialog', () => {
  it('names the package being edited in the subtitle', () => {
    expect(element(render()).textContent).toContain('«أساسية»');
  });

  it('says it adds a package when it opens for a new one', () => {
    const fixture = TestBed.createComponent(PlanFormDialog);
    fixture.componentRef.setInput('plan', basic);
    fixture.componentRef.setInput('mode', 'create');
    fixture.detectChanges();

    const text = element(fixture).textContent ?? '';
    expect(text).toContain('إضافة باقة جديدة');
    expect(text).not.toContain('تعديل الباقة');
  });

  it('fills the name field from the package', () => {
    const input = element(render()).querySelector<HTMLInputElement>('input[formControlName=name]');

    expect(input?.value).toBe('أساسية');
  });

  it('draws a stepper for each of the five allowances, the last one for stories', () => {
    const steppers = element(render()).querySelectorAll('app-limit-stepper');

    expect(steppers).toHaveLength(5);
    expect(steppers[4].textContent).toContain('القصص النشطة');
  });

  it('writes an unlimited allowance as words, not as a number', () => {
    expect(element(render(featured)).textContent).toContain('غير محدود');
  });

  function yearlyBadge(fixture: ReturnType<typeof render>): string {
    const badges = element(fixture).querySelectorAll('[data-role="badge"]');
    return badges[badges.length - 1].textContent?.trim() ?? '';
  }

  it('works out the yearly saving against twelve monthly payments', () => {
    // 20 a month is 240 a year, and the yearly price is 192.
    expect(yearlyBadge(render())).toBe('خصم 20%');
  });

  it('offers no discount badge when a year costs no less than twelve months', () => {
    expect(yearlyBadge(render({ ...basic, yearlyPrice: 240 }))).toBe('سنوي');
  });

  it('lists a row per feature and can add one', () => {
    const fixture = render();
    const rowsBefore = element(fixture).querySelectorAll('app-plan-feature-rows input').length;

    const addButton = [...element(fixture).querySelectorAll('button')].find((button) =>
      button.textContent?.includes('إضافة ميزة'),
    );
    addButton?.click();
    fixture.detectChanges();

    expect(element(fixture).querySelectorAll('app-plan-feature-rows input')).toHaveLength(
      rowsBefore + 1,
    );
  });

  it('hands back a draft when the form is saved', () => {
    const fixture = render();
    let saved: PlanDraft | null = null;
    fixture.componentInstance.saved.subscribe((draft: PlanDraft) => (saved = draft));

    element(fixture).querySelector('form')?.dispatchEvent(new Event('submit'));

    expect(saved).not.toBeNull();
    expect(saved!.name).toBe('أساسية');
  });

  it('refuses to save a package with no name', () => {
    const fixture = render();
    const saved = vi.fn();
    fixture.componentInstance.saved.subscribe(saved);
    const input = element(fixture).querySelector<HTMLInputElement>('input[formControlName=name]')!;
    input.value = '   ';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    element(fixture).querySelector('form')?.dispatchEvent(new Event('submit'));

    expect(saved).not.toHaveBeenCalled();
  });

  it('reports the cancel press', () => {
    const fixture = render();
    const cancelled = vi.fn();
    fixture.componentInstance.cancelled.subscribe(cancelled);

    const cancelButton = [...element(fixture).querySelectorAll('button')].find(
      (button) => button.textContent?.trim() === 'إلغاء',
    );
    cancelButton?.click();

    expect(cancelled).toHaveBeenCalled();
  });

  it('saves the currency picked beside either price, for the whole plan', () => {
    const fixture = render();
    let saved: PlanDraft | null = null;
    fixture.componentInstance.saved.subscribe((draft: PlanDraft) => (saved = draft));

    const pickers = element(fixture).querySelectorAll<HTMLSelectElement>(
      '[data-testid="currency-select"]',
    );
    expect(pickers).toHaveLength(2);
    pickers[1].value = 'SYP';
    pickers[1].dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(pickers[0].value).toBe('SYP');
    element(fixture).querySelector('form')?.dispatchEvent(new Event('submit'));
    expect(saved!.currency).toBe('SYP');
  });
});

describe('PlanFormDialog while saving', () => {
  it('spins on the save button and cannot be closed until the save ends', () => {
    const fixture = render();
    const closes = vi.fn();
    fixture.componentInstance.cancelled.subscribe(closes);
    fixture.componentRef.setInput('isBusy', true);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('button[type="submit"] app-spinner')).not.toBeNull();

    tryEveryWayOut(element);

    expect(closes).not.toHaveBeenCalled();
  });
});
