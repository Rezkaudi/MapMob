import { TestBed } from '@angular/core/testing';
import { StoryDraft } from '../../models/story-draft';
import { StoryFormOptions } from '../../models/story-form-options';
import { buildStory } from '../../testing/merchant-story-fixture';
import { StoryFormDialog } from './story-form-dialog';

const ADD: StoryFormOptions = {
  story: null,
  notice: 'متبقي لديك قصتان ضمن الباقة المجانية (الحد المسموح 5 قصص)',
};
const EDIT: StoryFormOptions = { story: buildStory({ caption: 'النص القديم' }), notice: null };
const PICTURE = new File(['x'], 'serum.jpg', { type: 'image/jpeg' });
const VIDEO = new File(['x'], 'tour.mp4', { type: 'video/mp4' });
const DOCUMENT = new File(['x'], 'notes.pdf', { type: 'application/pdf' });

function build(dialog: StoryFormOptions = ADD) {
  URL.createObjectURL = () => 'blob:preview';
  const fixture = TestBed.createComponent(StoryFormDialog);
  fixture.componentRef.setInput('dialog', dialog);
  const drafts: StoryDraft[] = [];
  fixture.componentInstance.submitted.subscribe((draft) => drafts.push(draft));
  fixture.detectChanges();
  return { fixture, drafts };
}

type Fixture = ReturnType<typeof build>['fixture'];

function pick(fixture: Fixture, file: File) {
  const input: HTMLInputElement = fixture.nativeElement.querySelector('input[type="file"]');
  Object.defineProperty(input, 'files', { value: [file], configurable: true });
  input.dispatchEvent(new Event('change'));
  fixture.detectChanges();
}

function type(fixture: Fixture, text: string) {
  const area: HTMLTextAreaElement = fixture.nativeElement.querySelector('textarea');
  area.value = text;
  area.dispatchEvent(new Event('input'));
  fixture.detectChanges();
}

const query = <T extends HTMLElement = HTMLElement>(fixture: Fixture, selector: string) =>
  (fixture.nativeElement as HTMLElement).querySelector<T>(selector);
const submitOf = (fixture: Fixture) =>
  query<HTMLButtonElement>(fixture, '[data-testid="submit-story"]')!;

describe('StoryFormDialog', () => {
  it("shows the frame's heading, plan line, upload field and text field", () => {
    const { fixture } = build();
    const text = fixture.nativeElement.textContent;

    expect(query(fixture, 'h2')?.textContent?.trim()).toBe('إضافة قصة جديدة');
    expect(text).toContain('ستظهر للمستخدمين لمدة 24 ساعة فقط.');
    expect(query(fixture, '[data-role="notice"]')?.textContent?.trim()).toBe(
      'متبقي لديك قصتان ضمن الباقة المجانية (الحد المسموح 5 قصص)',
    );
    expect(text).toContain('صورة أو فيديو القصة');
    expect(text).toContain('اسحب وأفلت الصورة أو الفيديو هنا');
    expect(text).toContain('صورة حتى 5 ميجابايت (JPG, PNG) أو فيديو حتى 50 ميجابايت');
    expect(text).toContain('نص القصة (اختياري)');
    expect(query(fixture, 'textarea')?.getAttribute('placeholder')).toBe(
      'اكتب نصاً قصيراً و جذاباً للقصة يظهر للعملاء.',
    );
    expect(submitOf(fixture).textContent?.trim()).toBe('نشر القصة');
  });

  it('takes pictures and videos in its file picker', () => {
    const { fixture } = build();

    expect(query(fixture, 'input[type="file"]')?.getAttribute('accept')).toBe(
      'image/jpeg,image/png,video/*',
    );
  });

  it('keeps the publish button off until a file is picked', () => {
    const { fixture } = build();
    expect(submitOf(fixture).disabled).toBe(true);

    pick(fixture, PICTURE);

    expect(submitOf(fixture).disabled).toBe(false);
    expect(query(fixture, '[data-role="picked-file"]')?.textContent).toContain('serum.jpg');
    expect(query(fixture, '[data-role="picked-file"] img')?.getAttribute('src')).toBe(
      'blob:preview',
    );
  });

  it('refuses a file that is not a picture or a video and says why', () => {
    const { fixture } = build();

    pick(fixture, DOCUMENT);

    expect(query(fixture, '[role="alert"]')?.textContent?.trim()).toBe(
      'notes.pdf: يُسمح بصور JPG و PNG وملفات الفيديو فقط',
    );
    expect(submitOf(fixture).disabled).toBe(true);
  });

  it('lets the picked file be removed to choose another', () => {
    const { fixture } = build();
    pick(fixture, VIDEO);

    query(fixture, '[data-testid="remove-picked-story"]')!.click();
    fixture.detectChanges();

    expect(query(fixture, '[data-role="picked-file"]')).toBeNull();
    expect(query(fixture, 'app-file-dropzone')).not.toBeNull();
  });

  it('counts the typed characters against 120, as the frame writes it', () => {
    const { fixture } = build();
    expect(query(fixture, '[data-role="counter"]')?.textContent?.trim()).toBe('120/0 حرف');

    type(fixture, 'عرض جديد');

    expect(query(fixture, '[data-role="counter"]')?.textContent?.trim()).toBe('120/8 حرف');
    expect(query(fixture, 'textarea')?.getAttribute('maxlength')).toBe('120');
  });

  it('puts the label on the right and the counter on the left', () => {
    const row = query(build().fixture, '[data-role="caption-label"]')!;

    expect(row.firstElementChild?.tagName).toBe('LABEL');
    expect(row.lastElementChild?.getAttribute('data-role')).toBe('counter');
  });

  it('publishes the file with its trimmed text, or with no text at all', () => {
    const { fixture, drafts } = build();
    pick(fixture, PICTURE);
    type(fixture, '  عرض جديد  ');

    submitOf(fixture).click();
    type(fixture, '   ');
    submitOf(fixture).click();

    expect(drafts).toEqual([
      { file: PICTURE, caption: 'عرض جديد' },
      { file: PICTURE, caption: null },
    ]);
  });

  it('turns the publish button off while the story is being saved', () => {
    const { fixture, drafts } = build();
    pick(fixture, PICTURE);

    fixture.componentRef.setInput('isBusy', true);
    fixture.detectChanges();
    submitOf(fixture).click();

    expect(submitOf(fixture).disabled).toBe(true);
    expect(drafts).toEqual([]);
  });

  it('writes cancel first, so RTL puts the blue button leftmost as the frame does', () => {
    const { fixture } = build();
    const footer = [...fixture.nativeElement.querySelectorAll('footer button')] as HTMLElement[];

    expect(footer.map((button) => button.textContent?.trim())).toEqual(['إلغاء', 'نشر القصة']);
  });

  it('says it was cancelled from the button and from the cross', () => {
    const { fixture } = build();
    let cancelCount = 0;
    fixture.componentInstance.cancelled.subscribe(() => cancelCount++);

    query(fixture, '[data-testid="cancel-story"]')!.click();
    query(fixture, '[data-role="close-dialog"]')!.click();

    expect(cancelCount).toBe(2);
  });

  describe('editing a story', () => {
    it('opens on the saved picture and text, with no plan line', () => {
      const { fixture } = build(EDIT);

      expect(query(fixture, 'h2')?.textContent?.trim()).toBe('تعديل القصة');
      expect(query(fixture, '[data-role="notice"]')).toBeNull();
      expect(query(fixture, '[data-role="saved-file"] img')?.getAttribute('src')).toBe(
        'https://cdn.example.com/story-1.jpg',
      );
      expect(query<HTMLTextAreaElement>(fixture, 'textarea')?.value).toBe('النص القديم');
      expect(query(fixture, '[data-role="counter"]')?.textContent?.trim()).toBe('120/11 حرف');
      expect(submitOf(fixture).textContent?.trim()).toBe('حفظ التعديلات');
    });

    it('writes "استبدال" in blue, as it deletes nothing, and keeps "حذف" red', () => {
      const { fixture } = build(EDIT);
      const replace = query(fixture, '[data-testid="replace-saved-story"]')!;
      expect(replace.textContent?.trim()).toBe('استبدال');
      expect(replace.className).toContain('text-primary');

      replace.click();
      fixture.detectChanges();
      pick(fixture, PICTURE);

      expect(query(fixture, '[data-testid="remove-picked-story"]')?.className).toContain(
        'text-error',
      );
    });

    it('saves a new text and keeps the saved file', () => {
      const { fixture, drafts } = build(EDIT);
      type(fixture, 'نص جديد');

      submitOf(fixture).click();

      expect(drafts).toEqual([{ file: null, caption: 'نص جديد' }]);
    });

    it('swaps the file once another is picked, and needs one after the saved file is dropped', () => {
      const { fixture, drafts } = build(EDIT);

      query(fixture, '[data-testid="replace-saved-story"]')!.click();
      fixture.detectChanges();
      expect(submitOf(fixture).disabled).toBe(true);

      pick(fixture, VIDEO);
      submitOf(fixture).click();

      expect(drafts).toEqual([{ file: VIDEO, caption: 'النص القديم' }]);
    });
  });
});
