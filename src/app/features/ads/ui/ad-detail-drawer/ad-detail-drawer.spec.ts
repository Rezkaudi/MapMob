import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AdDetail } from '../../models/ad-detail';
import { buildAd, buildAdDetail } from '../../testing/ad-fixture';
import { buildAdDetailView } from '../../state/ad-detail-view';
import { AdDetailDrawer } from './ad-detail-drawer';

const RUNNING = buildAdDetail({ ad: buildAd({ status: 'active' }), mediaUrl: 'ads/winter.png' });

function render(detail: AdDetail | null = RUNNING, error: string | null = null) {
  const fixture = TestBed.createComponent(AdDetailDrawer);
  fixture.componentRef.setInput('detail', detail);
  fixture.componentRef.setInput('view', detail ? buildAdDetailView(detail) : null);
  fixture.componentRef.setInput('isLoading', detail === null && error === null);
  fixture.componentRef.setInput('error', error);
  fixture.detectChanges();
  return fixture;
}

describe('AdDetailDrawer', () => {
  beforeEach(() => TestBed.configureTestingModule({ providers: [provideRouter([])] }));

  it('shows the ad text, its media and every fact of the campaign', () => {
    const text = (render().nativeElement as HTMLElement).textContent?.replace(/\s+/g, ' ') ?? '';

    expect(text).toContain('خصم 30% على جميع الأزياء الشتوية');
    expect(text).toContain(RUNNING.text);
    expect(text).toContain('ألبسة الفاخر');
    expect(text).toContain('الصفحة الرئيسية');
    expect(text).toContain('البانر الرئيسي العلوي');
    expect(text).toContain('١٢ يناير ٢٠٢٤ حتى ٢٦ يناير ٢٠٢٤');
    expect(
      (render().nativeElement as HTMLElement).querySelector('img[data-role="ad-media"]'),
    ).toBeTruthy();
  });

  it('plays a video ad instead of showing a picture', () => {
    const fixture = render(
      buildAdDetail({ ad: buildAd({ contentType: 'video' }), mediaUrl: 'ads/clip.mp4' }),
    );

    expect(fixture.nativeElement.querySelector('video[data-role="ad-media"]')).toBeTruthy();
  });

  it('reports the ad the footer acts on', () => {
    const fixture = render();
    const edit = vi.fn();
    const statusChange = vi.fn();
    const remove = vi.fn();
    fixture.componentInstance.edit.subscribe(edit);
    fixture.componentInstance.statusChange.subscribe(statusChange);
    fixture.componentInstance.remove.subscribe(remove);
    const buttons = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll('app-ad-detail-actions button'),
    ) as HTMLButtonElement[];

    expect(buttons.map((button) => button.textContent?.trim())).toEqual([
      'تعديل الإعلان',
      'إيقاف الإعلان',
      'حذف',
    ]);
    buttons.forEach((button) => button.click());

    expect(edit).toHaveBeenCalledWith(RUNNING.ad);
    expect(statusChange).toHaveBeenCalledWith(RUNNING.ad);
    expect(remove).toHaveBeenCalledWith(RUNNING.ad);
  });

  it('offers a retry when the ad could not be loaded', () => {
    const fixture = render(null, 'تعذر التحميل');
    const retry = vi.fn();
    fixture.componentInstance.retry.subscribe(retry);

    expect(fixture.nativeElement.textContent).toContain('تعذر التحميل');
    (fixture.nativeElement.querySelector('app-error-state button') as HTMLButtonElement).click();

    expect(retry).toHaveBeenCalled();
  });
});
