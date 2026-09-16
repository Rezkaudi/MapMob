import { TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { createAdFormGroup } from '../../state/ad-form-group';
import { AdMediaCard } from './ad-media-card';

const PICKED = {
  file: null,
  name: 'summer.jpg',
  previewUrl: 'blob:1',
  sizeInBytes: 10,
  width: null,
  height: null,
};

function render() {
  const form = createAdFormGroup(TestBed.inject(FormBuilder));
  const fixture = TestBed.createComponent(AdMediaCard);
  fixture.componentRef.setInput('form', form);
  fixture.componentRef.setInput('media', PICKED);
  fixture.detectChanges();
  return { fixture, form, element: fixture.nativeElement as HTMLElement };
}

describe('AdMediaCard', () => {
  it('offers a banner picture on the right and a video on the left, with the optional text', () => {
    const { element } = render();
    const cards = Array.from(
      element.querySelectorAll('[role="radiogroup"] [role="radio"]'),
      (card) => [card.textContent?.trim(), card.getAttribute('aria-checked')],
    );

    expect(cards).toEqual([
      ['صورة ثابتة (Banner)', 'true'],
      ['فيديو ترويجي', 'false'],
    ]);
    expect(element.textContent).toContain('نص الإعلان الترويجي (اختياري)');
    expect((element.querySelector('#ad-text') as HTMLTextAreaElement).placeholder).toContain(
      'خصم 25%',
    );
  });

  it('switches to video and drops the picture picked for the banner', () => {
    const { fixture, form, element } = render();
    const mediaChange = vi.fn();
    fixture.componentInstance.mediaChange.subscribe(mediaChange);

    (
      element.querySelectorAll('[role="radiogroup"] [role="radio"]')[1] as HTMLButtonElement
    ).click();
    fixture.detectChanges();

    expect(form.controls.contentType.value).toBe('video');
    expect(mediaChange).toHaveBeenCalledWith(null);
    expect(element.querySelector('app-image-upload-field')?.textContent).toContain(
      'اسحب وأفلت الفيديو هنا',
    );
  });
});
