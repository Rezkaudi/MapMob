import { TestBed } from '@angular/core/testing';
import { CampaignStatus } from '../../models/campaign-status';
import { CampaignStatusPill } from './campaign-status-pill';

function pillFor(status: CampaignStatus): HTMLElement {
  const fixture = TestBed.createComponent(CampaignStatusPill);
  fixture.componentRef.setInput('status', status);
  fixture.detectChanges();
  return (fixture.nativeElement as HTMLElement).querySelector('span') as HTMLElement;
}

describe('CampaignStatusPill', () => {
  it('words and colours each status as the design does', () => {
    expect(
      [pillFor('active'), pillFor('scheduled'), pillFor('paused')].map((pill) => [
        pill.textContent?.trim(),
        pill.className.match(/bg-\S+/)?.[0],
      ]),
    ).toEqual([
      ['نشط', 'bg-status-success'],
      ['قادم', 'bg-[#94a3b8]'],
      ['متوقف', 'bg-status-error'],
    ]);
  });

  it('gives expired offers and drafts their own words', () => {
    expect(pillFor('expired').textContent?.trim()).toBe('منتهي');
    expect(pillFor('draft').textContent?.trim()).toBe('مسودة');
  });
});
