import { TestBed } from '@angular/core/testing';
import { ShareBar } from './share-bar';
import { ShareBarTone } from './share-bar-tone';

describe('ShareBar', () => {
  function render(share: number, tone: ShareBarTone = 'blue'): HTMLElement {
    const fixture = TestBed.createComponent(ShareBar);
    fixture.componentRef.setInput('share', share);
    fixture.componentRef.setInput('tone', tone);
    fixture.componentRef.setInput('label', 'دمشق');
    fixture.detectChanges();
    return fixture.nativeElement;
  }

  function fillOf(host: HTMLElement): HTMLElement {
    return host.querySelector('[data-role="share-fill"]')!;
  }

  it('fills the track to the given share', () => {
    expect(fillOf(render(42)).style.width).toBe('42%');
  });

  it('keeps the fill inside the track when the share is out of range', () => {
    expect(fillOf(render(140)).style.width).toBe('100%');
    expect(fillOf(render(-5)).style.width).toBe('0%');
  });

  it('paints the fill with its tone', () => {
    expect(fillOf(render(10, 'violet')).className).toContain('bg-[#8200df]');
    expect(fillOf(render(10, 'red')).className).toContain('bg-status-error');
  });

  it('tells screen readers what the bar measures', () => {
    const meter = render(32).querySelector('[role="meter"]')!;

    expect(meter.getAttribute('aria-label')).toBe('دمشق');
    expect(meter.getAttribute('aria-valuenow')).toBe('32');
  });
});
