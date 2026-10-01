import { TestBed } from '@angular/core/testing';
import { ConfirmActionCopy } from './confirm-action-copy';
import { ConfirmActionDialog } from './confirm-action-dialog';

const ACTIVATE_COPY: ConfirmActionCopy = {
  title: 'تفعيل المحافظة',
  question: 'هل تريد تفعيل محافظة طرطوس؟',
  detail: 'ستصبح متاحة للاستخدام عند إضافة أماكن جديدة.',
  confirmLabel: 'تفعيل المحافظة',
  tone: 'success',
};

const SUSPEND_COPY: ConfirmActionCopy = {
  title: 'تعطيل المحافظة',
  question: 'هل أنت متأكد من تعطيل محافظة طرطوس؟',
  detail: 'لن تظهر هذه المحافظة كخيار عند إضافة أماكن جديدة.',
  confirmLabel: 'تعطيل المحافظة',
  tone: 'danger',
};

function render(action: 'activate' | 'suspend', isBusy = false) {
  const fixture = TestBed.createComponent(ConfirmActionDialog);
  fixture.componentRef.setInput('copy', action === 'activate' ? ACTIVATE_COPY : SUSPEND_COPY);
  fixture.componentRef.setInput('isBusy', isBusy);
  fixture.detectChanges();
  return fixture;
}

function buttonNamed(element: HTMLElement, label: string): HTMLButtonElement {
  return Array.from(element.querySelectorAll('button')).find(
    (button) => button.textContent?.trim() === label,
  ) as HTMLButtonElement;
}

describe('ConfirmActionDialog', () => {
  it('shows the title, both lines of the message and the actions', () => {
    const element = render('activate').nativeElement as HTMLElement;

    expect(element.querySelector('h2')?.textContent?.trim()).toBe('تفعيل المحافظة');
    expect(element.textContent).toContain('هل تريد تفعيل محافظة طرطوس؟');
    expect(element.textContent).toContain('ستصبح متاحة للاستخدام عند إضافة أماكن جديدة.');
    expect(buttonNamed(element, 'تفعيل المحافظة').className).toContain('bg-status-success');
    expect(buttonNamed(element, 'إلغاء')).toBeTruthy();
  });

  it('paints a suspend request red', () => {
    const element = render('suspend').nativeElement as HTMLElement;

    expect(buttonNamed(element, 'تعطيل المحافظة').className).toContain('bg-closed');
  });

  it('reports confirm, cancel, a click on the backdrop and the Escape key', () => {
    const fixture = render('activate');
    const confirmed = vi.fn();
    const cancelled = vi.fn();
    fixture.componentInstance.confirmed.subscribe(confirmed);
    fixture.componentInstance.cancelled.subscribe(cancelled);
    const element = fixture.nativeElement as HTMLElement;

    buttonNamed(element, 'تفعيل المحافظة').click();
    buttonNamed(element, 'إلغاء').click();
    (element.querySelector('[role="dialog"]') as HTMLElement).click();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

    expect(confirmed).toHaveBeenCalledOnce();
    expect(cancelled).toHaveBeenCalledTimes(3);
  });

  it('locks the confirm button while the request runs', () => {
    const element = render('activate', true).nativeElement as HTMLElement;

    expect(buttonNamed(element, 'تفعيل المحافظة').disabled).toBe(true);
  });
});

const PAUSE_COPY: ConfirmActionCopy = {
  title: 'إيقاف الإعلان',
  question: 'هل أنت متأكد من رغبتك في إيقاف هذا الإعلان؟',
  detail: 'تم تحديد 5 شركات',
  confirmLabel: 'إيقاف الإعلان',
  tone: 'warning',
  detailAppearance: 'toned',
};

const CRITICAL_COPY: ConfirmActionCopy = {
  title: 'حذف الإعلان',
  question: 'هل أنت متأكد من رغبتك في حذف هذا الإعلان نهائياً؟',
  detail: 'تنبيه: إجراء نهائي لا يمكن التراجع عنه',
  confirmLabel: 'حذف الإعلان',
  tone: 'critical',
  detailAppearance: 'callout',
};

function renderCopy(copy: ConfirmActionCopy) {
  const fixture = TestBed.createComponent(ConfirmActionDialog);
  fixture.componentRef.setInput('copy', copy);
  fixture.detectChanges();
  return fixture.nativeElement as HTMLElement;
}

describe('ConfirmActionDialog tones from the ad design', () => {
  it('paints a pause request amber and writes its detail line in the same colour', () => {
    const element = renderCopy(PAUSE_COPY);

    expect(buttonNamed(element, 'إيقاف الإعلان').className).toContain('bg-accent');
    const detail = element.querySelector('[data-role="confirm-detail"]');
    expect(detail?.textContent?.trim()).toBe('تم تحديد 5 شركات');
    expect(detail?.className).toContain('text-accent');
  });

  it('wraps a critical detail in the red warning callout', () => {
    const element = renderCopy(CRITICAL_COPY);

    const callout = element.querySelector('[data-role="confirm-detail"]');
    expect(callout?.className).toContain('border-[#fecaca]');
    expect(callout?.textContent?.trim()).toBe('تنبيه: إجراء نهائي لا يمكن التراجع عنه');
    expect(buttonNamed(element, 'حذف الإعلان').className).toContain('bg-status-error');
  });

  it('keeps the plain muted detail line when no appearance is asked for', () => {
    const element = renderCopy(ACTIVATE_COPY);

    const detail = element.querySelector('[data-role="confirm-detail"]');
    expect(detail?.className).toContain('text-text-secondary');
  });
});

describe('ConfirmActionDialog context card from the story design', () => {
  const STORY_COPY: ConfirmActionCopy = {
    ...CRITICAL_COPY,
    context: {
      lines: ['صيدلية الشفاء • قصة اليوم', 'حصلت القصة على 842 مشاهدة'],
      imageUrl: 'https://cdn.example.com/story.jpg',
    },
  };

  it('names what is being deleted between the question and the warning', () => {
    const element = renderCopy(STORY_COPY);

    const context = element.querySelector('[data-role="confirm-context"]')!;
    const lines = [...context.querySelectorAll('[data-role="context-line"]')];
    expect(lines.map((line) => line.textContent?.trim())).toEqual([
      'صيدلية الشفاء • قصة اليوم',
      'حصلت القصة على 842 مشاهدة',
    ]);
    expect(context.nextElementSibling?.getAttribute('data-role')).toBe('confirm-detail');
  });

  it('leads with the picture, so RTL puts it on the right', () => {
    const context = renderCopy(STORY_COPY).querySelector('[data-role="confirm-context"]')!;

    expect(context.firstElementChild?.getAttribute('data-role')).toBe('context-picture');
    expect(context.querySelector('img')?.getAttribute('src')).toBe(
      'https://cdn.example.com/story.jpg',
    );
  });

  it('keeps the grey tile when there is no picture to show', () => {
    const element = renderCopy({
      ...STORY_COPY,
      context: { lines: ['صيدلية الشفاء • قصة اليوم'], imageUrl: null },
    });

    expect(element.querySelector('[data-role="context-picture"]')).not.toBeNull();
    expect(element.querySelector('[data-role="confirm-context"] img')).toBeNull();
  });

  it('pulls the icon 4px closer and sets both boxes 4px in, as the story frame draws them', () => {
    const element = renderCopy(STORY_COPY);

    expect(element.querySelector('[data-role="confirm-icon"]')?.className).toContain('pb-3');
    expect(element.querySelector('[data-role="confirm-context"]')?.className).toContain(
      'w-[calc(100%-8px)]',
    );
    expect(element.querySelector('[data-role="confirm-detail"]')?.className).toContain(
      'w-[calc(100%-8px)]',
    );
  });

  it('keeps the spacing of the other dialogs when there is no context card', () => {
    const element = renderCopy(CRITICAL_COPY);

    expect(element.querySelector('[data-role="confirm-icon"]')?.className).toContain('pb-4');
    expect(element.querySelector('[data-role="confirm-detail"]')?.className).toContain('w-full');
  });

  it('draws no context card for the other dialogs', () => {
    expect(renderCopy(CRITICAL_COPY).querySelector('[data-role="confirm-context"]')).toBeNull();
  });
});

describe('ConfirmActionDialog hide and show dialogs from the admin story design', () => {
  const SHOW_COPY: ConfirmActionCopy = {
    title: 'إظهار القصة',
    question: 'هل أنت متأكد من إظهار القصة مرة أخرى؟ ستصبح القصة مرئية للمستخدمين مجدداً.',
    confirmLabel: 'إظهار القصة',
    tone: 'success',
    icon: { name: 'eye-clarity', size: 24 },
    context: {
      lines: ['صيدلية الشفاء • قصة اليوم', 'حصلت هذه القصة على 842 مشاهدة'],
      imageUrl: null,
      tag: 'الحالة: مخفية',
    },
  };

  it('draws the icon the copy names instead of the one of its tone', () => {
    const icon = renderCopy(SHOW_COPY).querySelector('[data-role="confirm-icon"] app-icon span');

    expect((icon as HTMLElement).style.maskImage).toContain('eye-clarity.svg');
    expect((icon as HTMLElement).style.width).toBe('24px');
  });

  it('keeps the icon of the tone when the copy names none', () => {
    const icon = renderCopy(CRITICAL_COPY).querySelector(
      '[data-role="confirm-icon"] app-icon span',
    );

    expect((icon as HTMLElement).style.maskImage).toContain('close-stroke.svg');
  });

  it('writes the tag after the first line, so RTL sets it at the left end of that row', () => {
    const context = renderCopy(SHOW_COPY).querySelector('[data-role="confirm-context"]')!;
    const tag = context.querySelector('[data-role="context-tag"]')!;

    expect(tag.textContent?.trim()).toBe('الحالة: مخفية');
    expect(tag.previousElementSibling?.textContent?.trim()).toBe('صيدلية الشفاء • قصة اليوم');
    expect(tag.parentElement?.className).toContain('justify-between');
  });

  it('keeps the card 68px tall although the tag row is 24px', () => {
    const context = renderCopy(SHOW_COPY).querySelector('[data-role="confirm-context"]')!;

    expect(context.classList).toContain('h-[68px]');
    expect(context.querySelector('[data-role="context-tag"]')?.parentElement?.classList).toContain(
      'h-6',
    );
  });

  it('draws no tag on a context card without one', () => {
    const element = renderCopy({
      ...CRITICAL_COPY,
      context: { lines: ['صيدلية الشفاء • قصة اليوم'], imageUrl: null },
    });

    expect(element.querySelector('[data-role="context-tag"]')).toBeNull();
  });

  it('has no third line and sets the buttons 18px under the card when the copy has no detail', () => {
    const element = renderCopy(SHOW_COPY);

    expect(element.querySelector('[data-role="confirm-detail"]')).toBeNull();
    expect(buttonNamed(element, 'إلغاء').parentElement?.classList).toContain('mt-[18px]');
  });

  it('wraps a long question inside 360px, as the frame does', () => {
    const question = renderCopy(SHOW_COPY).querySelector('h2 + p')!;

    expect(question.classList).toContain('max-w-[360px]');
  });
});
