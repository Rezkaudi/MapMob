import { TestBed } from '@angular/core/testing';
import { CampaignPauseAction } from '../../../../shared/models/campaign-pause-action';
import { MerchantOfferActions } from './merchant-offer-actions';

function build(pauseAction: CampaignPauseAction | null, isBusy = false) {
  const fixture = TestBed.createComponent(MerchantOfferActions);
  fixture.componentRef.setInput('pauseAction', pauseAction);
  fixture.componentRef.setInput('isBusy', isBusy);
  fixture.detectChanges();
  const log: string[] = [];
  const instance = fixture.componentInstance;
  instance.edit.subscribe(() => log.push('edit'));
  instance.pause.subscribe(() => log.push('pause'));
  instance.resume.subscribe(() => log.push('resume'));
  instance.remove.subscribe(() => log.push('remove'));
  return {
    buttons: [...fixture.nativeElement.querySelectorAll('button')] as HTMLButtonElement[],
    log,
  };
}

const labels = (buttons: HTMLButtonElement[]) =>
  buttons.map((button) => button.textContent?.trim());

describe('MerchantOfferActions', () => {
  it('lays edit, pause and delete out right to left and reports each', () => {
    const { buttons, log } = build('pause');

    expect(labels(buttons)).toEqual(['تعديل العرض', 'إيقاف العرض', 'حذف']);
    buttons.forEach((button) => button.click());
    expect(log).toEqual(['edit', 'pause', 'remove']);
  });

  it('offers "تفعيل العرض" for a paused offer and neither for an ended one', () => {
    const paused = build('resume');
    paused.buttons[1].click();
    expect(labels(paused.buttons)[1]).toBe('تفعيل العرض');
    expect(paused.log).toEqual(['resume']);

    expect(labels(build(null).buttons)).toEqual(['تعديل العرض', 'حذف']);
  });

  it('writes each icon before its label so RTL puts it on the right', () => {
    for (const button of build('pause').buttons) {
      expect(button.firstElementChild?.tagName.toLowerCase()).toBe('app-icon');
    }
  });

  it('holds every button while a change is saving', () => {
    expect(build('pause', true).buttons.every((button) => button.disabled)).toBe(true);
  });
});
