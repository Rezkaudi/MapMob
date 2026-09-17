import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NEVER, Observable, of, throwError } from 'rxjs';
import { ComplaintRepository } from '../../data/complaint.repository';
import { ComplaintReview } from '../../models/complaint-review';
import { buildComplaintDetail } from '../../testing/complaint-fixture';
import { ComplaintDetailPage } from './complaint-detail';

const DETAIL = buildComplaintDetail();

function render(overrides: Partial<ComplaintRepository> = {}) {
  const savedReviews: ComplaintReview[] = [];
  const repository: Partial<ComplaintRepository> = {
    getComplaint: () => of(DETAIL),
    saveReview: (_id, review) => {
      savedReviews.push(review);
      return of({ ...DETAIL, ...review });
    },
    ...overrides,
  };
  TestBed.configureTestingModule({
    providers: [provideRouter([]), { provide: ComplaintRepository, useValue: repository }],
  });
  const fixture = TestBed.createComponent(ComplaintDetailPage);
  fixture.componentRef.setInput('id', 'complaint-1');
  fixture.detectChanges();
  return { fixture, element: fixture.nativeElement as HTMLElement, savedReviews };
}

function buttonNamed(root: ParentNode, label: string): HTMLButtonElement {
  return Array.from(root.querySelectorAll('button')).find(
    (button) => button.textContent?.trim() === label,
  ) as HTMLButtonElement;
}

describe('ComplaintDetail page', () => {
  it('leads with a breadcrumb back to the list and the title', () => {
    const { element } = render();
    const crumb = element.querySelector('nav[aria-label="مسار الصفحة"]') as HTMLElement;

    expect(crumb.querySelector('a')?.getAttribute('href')).toBe('/complaints');
    expect(crumb.textContent).toContain('تفاصيل البلاغ');
    expect(element.querySelector('h1')?.textContent?.trim()).toBe('تفاصيل البلاغ');
  });

  it('shows the four cards of the complaint', () => {
    const { element } = render();

    for (const selector of [
      'app-complaint-content-card',
      'app-complaint-review-card',
      'app-complaint-reporter-card',
      'app-reported-place-card',
    ]) {
      expect(element.querySelector(selector)).toBeTruthy();
    }
  });

  it('saves the picked status and notes, then confirms it', async () => {
    const { fixture, element, savedReviews } = render();
    const select = element.querySelector('select') as HTMLSelectElement;
    select.value = 'resolved';
    select.dispatchEvent(new Event('change'));
    const notes = element.querySelector('textarea') as HTMLTextAreaElement;
    notes.value = 'تم تصحيح العنوان';
    notes.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    buttonNamed(element, 'حفظ التغييرات').click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(savedReviews).toEqual([{ status: 'resolved', adminNotes: 'تم تصحيح العنوان' }]);
    expect(element.querySelector('app-toast')?.textContent).toContain('تم حفظ التغييرات');
    expect(
      element.querySelector('app-complaint-content-card app-complaint-status-pill')?.textContent,
    ).toContain('تم الحل');
  });

  it('shows why a save failed', async () => {
    const { fixture, element } = render({
      saveReview: (): Observable<never> => throwError(() => new Error('تعذر حفظ التغييرات')),
    });

    buttonNamed(element, 'حفظ التغييرات').click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(element.querySelector('app-toast')?.textContent).toContain('تعذر حفظ التغييرات');
  });

  it('draws placeholders while the complaint loads, with no save button', () => {
    const { element } = render({ getComplaint: () => NEVER });

    expect(element.querySelector('app-skeleton')).toBeTruthy();
    expect(buttonNamed(element, 'حفظ التغييرات')).toBeUndefined();
  });

  it('offers a retry when the complaint cannot be loaded', () => {
    let loads = 0;
    const { fixture, element } = render({
      getComplaint: () => {
        loads += 1;
        return throwError(() => new Error('لم يتم العثور على البلاغ'));
      },
    });

    expect(element.textContent).toContain('لم يتم العثور على البلاغ');
    buttonNamed(element, 'إعادة المحاولة').click();
    fixture.detectChanges();

    expect(loads).toBe(2);
  });
});
