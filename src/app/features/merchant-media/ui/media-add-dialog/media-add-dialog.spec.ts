import { TestBed } from '@angular/core/testing';
import { MediaAddOptions } from '../../models/media-add-options';
import { MediaDraft } from '../../models/media-draft';
import { MediaAddDialog } from './media-add-dialog';

const DIALOG: MediaAddOptions = {
  startKind: 'image',
  canAddImage: true,
  canAddVideo: true,
  notice: 'متبقي لديك وسيطان ضمن الباقة المجانية (الحد المسموح 5 وسائط)',
};
const PICTURE = new File(['x'], 'front.jpg', { type: 'image/jpeg' });
const VIDEO = new File(['x'], 'tour.mp4', { type: 'video/mp4' });

function build(dialog: MediaAddOptions = DIALOG) {
  URL.createObjectURL = () => 'blob:preview';
  const fixture = TestBed.createComponent(MediaAddDialog);
  fixture.componentRef.setInput('dialog', dialog);
  fixture.detectChanges();
  return fixture;
}

function pick(fixture: ReturnType<typeof build>, file: File) {
  const input: HTMLInputElement = fixture.nativeElement.querySelector('input[type="file"]');
  Object.defineProperty(input, 'files', { value: [file], configurable: true });
  input.dispatchEvent(new Event('change'));
  fixture.detectChanges();
}

const query = (fixture: ReturnType<typeof build>, selector: string): HTMLElement | null =>
  fixture.nativeElement.querySelector(selector);

describe('MediaAddDialog', () => {
  it("shows the frame's heading, notice and picture fields", () => {
    const text = build().nativeElement.textContent;

    expect(text).toContain('إضافة وسائط');
    expect(text).toContain(
      'أضف صورة او فيديو جديداً لمكانك ليتمكن المستخدمون من التعرف عليك أكثر.',
    );
    expect(text).toContain('متبقي لديك وسيطان ضمن الباقة المجانية (الحد المسموح 5 وسائط)');
    expect(text).toContain('نوع الوسائط');
    expect(text).toContain('رفع الصور');
    expect(text).toContain('الحد الأقصى لحجم الصورة 5 ميجابايت (JPG, PNG)');
    expect(text).toContain('تعيين كصورة رئيسية للمكان');
    expect(text).toContain('ستظهر كأول صورة في بطاقة المكان');
  });

  it('keeps the submit button off until a file is picked', () => {
    const fixture = build();
    const submit = query(fixture, '[data-testid="submit-media"]') as HTMLButtonElement;
    expect(submit.disabled).toBe(true);

    pick(fixture, PICTURE);

    expect(submit.disabled).toBe(false);
    expect(query(fixture, '[data-role="picked-file"]')?.textContent).toContain('front.jpg');
  });

  it('refuses a file of the wrong type and says why', () => {
    const fixture = build();

    pick(fixture, VIDEO);

    expect(query(fixture, '[role="alert"]')?.textContent?.trim()).toBe(
      'tour.mp4: يُسمح بصيغ JPG و PNG فقط',
    );
    expect((query(fixture, '[data-testid="submit-media"]') as HTMLButtonElement).disabled).toBe(
      true,
    );
  });

  it('sends a main picture', () => {
    const fixture = build();
    const drafts: MediaDraft[] = [];
    fixture.componentInstance.submitted.subscribe((draft) => drafts.push(draft));

    pick(fixture, PICTURE);
    query(fixture, '[data-testid="media-is-main"]')!.click();
    fixture.detectChanges();
    query(fixture, '[data-testid="submit-media"]')!.click();

    expect(drafts).toEqual([{ kind: 'image', file: PICTURE, isMain: true }]);
  });

  it('switches to video: new upload copy, no main choice, and the picked picture is dropped', () => {
    const fixture = build();
    const drafts: MediaDraft[] = [];
    fixture.componentInstance.submitted.subscribe((draft) => drafts.push(draft));
    pick(fixture, PICTURE);

    (fixture.nativeElement.querySelectorAll('[role="radio"]')[1] as HTMLElement).click();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('رفع الفيديو');
    expect(query(fixture, '[data-testid="media-is-main"]')).toBeNull();
    expect(query(fixture, '[data-role="picked-file"]')).toBeNull();

    pick(fixture, VIDEO);
    query(fixture, '[data-testid="submit-media"]')!.click();
    expect(drafts).toEqual([{ kind: 'video', file: VIDEO, isMain: false }]);
  });

  it('opens on the kind it was given', () => {
    const fixture = build({ ...DIALOG, startKind: 'video', canAddImage: false });

    expect(fixture.nativeElement.textContent).toContain('رفع الفيديو');
  });

  it('cancels from the footer', () => {
    const fixture = build();
    let cancelCount = 0;
    fixture.componentInstance.cancelled.subscribe(() => cancelCount++);

    query(fixture, '[data-testid="cancel-media"]')!.click();

    expect(cancelCount).toBe(1);
  });
});
