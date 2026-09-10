import { TestBed } from '@angular/core/testing';
import { Toast } from './toast';

describe('Toast', () => {
  it('shows the title and the message', () => {
    const fixture = TestBed.createComponent(Toast);
    fixture.componentRef.setInput('title', 'تم حفظ المكان بنجاح');
    fixture.componentRef.setInput('message', 'تمت إضافة المكان بنجاح.');
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('تم حفظ المكان بنجاح');
    expect(text).toContain('تمت إضافة المكان بنجاح.');
  });

  it('raises dismissed when the close button is pressed', () => {
    const fixture = TestBed.createComponent(Toast);
    fixture.componentRef.setInput('title', 'تم حفظ المكان بنجاح');
    fixture.componentRef.setInput('message', 'تمت إضافة المكان بنجاح.');
    fixture.detectChanges();

    let dismissed = 0;
    fixture.componentInstance.dismissed.subscribe(() => (dismissed += 1));
    fixture.nativeElement.querySelector('[data-testid="toast-close"]').click();

    expect(dismissed).toBe(1);
  });
});
