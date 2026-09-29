import { TestBed } from '@angular/core/testing';
import { MediaKindChoice } from './media-kind-choice';

function build(canAddVideo = true) {
  const fixture = TestBed.createComponent(MediaKindChoice);
  fixture.componentRef.setInput('selected', 'image');
  fixture.componentRef.setInput('canAddImage', true);
  fixture.componentRef.setInput('canAddVideo', canAddVideo);
  fixture.detectChanges();
  return fixture;
}

const segmentsOf = (fixture: ReturnType<typeof build>) =>
  [...fixture.nativeElement.querySelectorAll('[role="radio"]')] as HTMLButtonElement[];

describe('MediaKindChoice', () => {
  it('lists صورة first so RTL puts it on the right, raised when picked', () => {
    const segments = segmentsOf(build());

    expect(segments.map((segment) => segment.textContent?.trim())).toEqual(['صورة', 'فيديو']);
    expect(segments[0].getAttribute('aria-checked')).toBe('true');
    expect(segments[0].className).toContain('bg-white');
  });

  it('asks for the kind that was clicked', () => {
    const fixture = build();
    const picked: string[] = [];
    fixture.componentInstance.selectedChange.subscribe((kind) => picked.push(kind));

    segmentsOf(fixture)[1].click();

    expect(picked).toEqual(['video']);
  });

  it('turns off a kind the plan has no room for', () => {
    const segments = segmentsOf(build(false));

    expect(segments[1].disabled).toBe(true);
    expect(segments[1].title).toBe('وصلت للحد المتاح من الفيديوهات في باقتك');
  });
});
