import { TestBed } from '@angular/core/testing';
import { NotificationRecipient } from '../../models/notification-recipient';
import { NotificationRecipientPicker } from './notification-recipient-picker';

const SARA: NotificationRecipient = {
  id: 'r1',
  name: 'سارة أحمد التميمي',
  phone: '0501234567',
  city: 'طرطوس',
};
const ALI: NotificationRecipient = {
  id: 'r2',
  name: 'علي خالد الحسن',
  phone: '0501234568',
  city: 'دمشق',
};

function render(
  inputs: { recipients?: readonly NotificationRecipient[]; isLoading?: boolean } = {},
) {
  const fixture = TestBed.createComponent(NotificationRecipientPicker);
  fixture.componentRef.setInput('recipients', inputs.recipients ?? [SARA, ALI]);
  fixture.componentRef.setInput('selectedIds', ['r2']);
  fixture.componentRef.setInput('isLoading', inputs.isLoading ?? false);
  fixture.componentRef.setInput('error', null);
  fixture.detectChanges();
  return { fixture, element: fixture.nativeElement as HTMLElement };
}

describe('NotificationRecipientPicker', () => {
  it('lists each recipient with a tick, the name, and the city and phone', () => {
    const { element } = render();
    const rows = element.querySelectorAll('label[data-role="recipient"]');

    expect(element.querySelector('input[type="search"]')?.getAttribute('placeholder')).toBe(
      'ابحث باسم المستخدم أو رقم الهاتف...',
    );
    expect(rows).toHaveLength(2);
    expect(rows[0].textContent).toContain('سارة أحمد التميمي');
    expect(rows[0].textContent).toContain('0501234567');
    expect(rows[0].textContent).toContain('طرطوس');
    expect((rows[1].querySelector('input') as HTMLInputElement).checked).toBe(true);
  });

  it('adds and removes picks, and passes the search on', () => {
    const { fixture, element } = render();
    const selectedIdsChange = vi.fn();
    const searchChange = vi.fn();
    fixture.componentInstance.selectedIdsChange.subscribe(selectedIdsChange);
    fixture.componentInstance.searchChange.subscribe(searchChange);
    const boxes = element.querySelectorAll<HTMLInputElement>('label[data-role="recipient"] input');

    boxes[0].dispatchEvent(new Event('change'));
    boxes[1].dispatchEvent(new Event('change'));
    const search = element.querySelector('input[type="search"]') as HTMLInputElement;
    search.value = 'سارة';
    search.dispatchEvent(new Event('input'));

    expect(selectedIdsChange.mock.calls).toEqual([[['r2', 'r1']], [[]]]);
    expect(searchChange).toHaveBeenCalledWith('سارة');
  });

  it('says when nothing matches, and shows skeletons while loading', () => {
    expect(render({ recipients: [] }).element.textContent).toContain('لا توجد نتائج مطابقة');
    expect(render({ isLoading: true }).element.querySelector('app-skeleton')).toBeTruthy();
  });
});
