import { TestBed } from '@angular/core/testing';
import { AudienceEstimate } from '../../models/audience-estimate';
import { NotificationGovernorate } from '../../models/notification-form-options';
import { NotificationLocationCriteria } from './notification-location-criteria';

const GOVERNORATES: readonly NotificationGovernorate[] = [
  {
    id: 'g1',
    name: 'طرطوس',
    areas: [
      { id: 'a1', name: 'صافيتا' },
      { id: 'a2', name: 'الدريكيش' },
    ],
  },
  { id: 'g2', name: 'حمص', areas: [{ id: 'a3', name: 'تلكلخ' }] },
];

function render(
  inputs: {
    governorateId?: string | null;
    estimate?: AudienceEstimate | null;
    error?: string | null;
  } = {},
) {
  const fixture = TestBed.createComponent(NotificationLocationCriteria);
  fixture.componentRef.setInput('governorates', GOVERNORATES);
  fixture.componentRef.setInput('governorateId', inputs.governorateId ?? null);
  fixture.componentRef.setInput('areaId', null);
  fixture.componentRef.setInput('estimate', inputs.estimate ?? null);
  fixture.componentRef.setInput('error', inputs.error ?? null);
  fixture.detectChanges();
  return { fixture, element: fixture.nativeElement as HTMLElement };
}

function optionsOf(element: HTMLElement, label: string): string[] {
  return Array.from(
    element.querySelectorAll(`select[aria-label="${label}"] option`),
    (option) => option.textContent?.trim() ?? '',
  );
}

describe('NotificationLocationCriteria', () => {
  it('lists the governorates, and only the picked governorate\'s areas after "الكل"', () => {
    const { element } = render({ governorateId: 'g1' });

    expect(element.textContent).toContain('معايير التخصيص الجغرافي والسلوكي');
    expect(optionsOf(element, 'المحافظة')).toEqual(['اختر المحافظة', 'محافظة طرطوس', 'محافظة حمص']);
    expect(optionsOf(element, 'المنطقة')).toEqual(['الكل', 'صافيتا', 'الدريكيش']);
  });

  it('reports the picks, clearing the area when the governorate changes', () => {
    const { fixture, element } = render({ governorateId: 'g1' });
    const governorateIdChange = vi.fn();
    const areaIdChange = vi.fn();
    fixture.componentInstance.governorateIdChange.subscribe(governorateIdChange);
    fixture.componentInstance.areaIdChange.subscribe(areaIdChange);
    const pick = (label: string, value: string) => {
      const select = element.querySelector(`select[aria-label="${label}"]`) as HTMLSelectElement;
      select.value = value;
      select.dispatchEvent(new Event('change'));
    };

    pick('المنطقة', 'a2');
    pick('المنطقة', '');
    pick('المحافظة', 'g2');

    expect(areaIdChange.mock.calls).toEqual([['a2'], [null], [null]]);
    expect(governorateIdChange).toHaveBeenCalledWith('g2');
  });

  it('shows the estimate banner once there is one, and the error when no governorate is picked', () => {
    const withEstimate = render({
      governorateId: 'g1',
      estimate: { deviceCount: 16840, sharePercent: 68.5 },
    });
    const withError = render({ error: 'اختر المحافظة' });

    expect(withEstimate.element.textContent).toContain('الجمهور المقدر: 16,840 جهاز نشط');
    expect(withEstimate.element.textContent).toContain(
      'يمثل حوالي 68.5% من إجمالي قاعدة المشتركين',
    );
    expect(withError.element.querySelector('[role="alert"]')?.textContent?.trim()).toBe(
      'اختر المحافظة',
    );
    expect(withError.element.textContent).not.toContain('الجمهور المقدر');
  });
});
