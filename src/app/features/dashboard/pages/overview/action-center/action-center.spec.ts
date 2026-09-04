import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActionItem } from '../../../models/action-item';
import { ActionCenter } from './action-center';

const ITEMS: readonly ActionItem[] = [
  { id: 'complaints', label: 'بلاغ جديد', count: 12, tone: 'error' },
  { id: 'pending-places', label: 'متجر بانتظار الموافقة', count: 37, tone: 'info' },
];

@Component({ imports: [ActionCenter], template: `<app-action-center [items]="items" />` })
class HostComponent {
  readonly items = ITEMS;
}

describe('ActionCenter', () => {
  it('shows the card heading and subtitle', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('يحتاج إلى إجراء');
    expect(text).toContain('عناصر تحتاج إلى مراجعتك');
  });

  it('reads each row as a count followed by its label', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const rows = fixture.nativeElement.querySelectorAll('li');
    expect(rows.length).toBe(2);
    expect(rows[0].textContent).toContain('12 بلاغ جديد');
    expect(rows[1].textContent).toContain('37 متجر بانتظار الموافقة');
  });

  it('gives every row a review button', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('li button');
    expect(buttons.length).toBe(2);
    expect(buttons[0].textContent.trim()).toBe('مراجعة');
  });
});
