import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  SecurityContext,
  computed,
  forwardRef,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { EditingCommandRunner } from '../../editing/editing-command-runner';
import { editingStepFor } from '../../editing/editing-step';
import { normalizeLinkUrl } from '../../editing/link-url';
import { readRichTextState } from '../../editing/read-rich-text-state';
import { toStoredEditorHtml } from '../../editing/stored-editor-html';
import { RichTextCommand } from '../../models/rich-text-command';
import { EMPTY_RICH_TEXT_STATE } from '../../models/rich-text-state';
import { RichTextToolbar } from '../rich-text-toolbar/rich-text-toolbar';

/** `summary` is the short grey "نبذة" box; `document` is the long terms and privacy text. */
export type RichTextAppearance = 'summary' | 'document';

const AREA_CLASSES: Record<RichTextAppearance, string> = {
  summary: 'min-h-[180px] text-[16px]/[24px] text-text-secondary',
  document: 'min-h-[300px] text-[14px]/[20px] text-text-primary',
};

const LINK_PROMPT = 'أدخل عنوان الرابط';

/** A toolbar over a `contenteditable` area; its value is the HTML, so it plugs into reactive forms. */
@Component({
  selector: 'app-rich-text-editor',
  imports: [RichTextToolbar],
  templateUrl: './rich-text-editor.html',
  host: { class: 'block' },
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => RichTextEditor), multi: true },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RichTextEditor implements ControlValueAccessor {
  readonly appearance = input<RichTextAppearance>('document');
  readonly ariaLabel = input.required<string>();
  readonly isInvalid = input<boolean>(false);

  private readonly runner = inject(EditingCommandRunner);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly area = viewChild.required<ElementRef<HTMLElement>>('area');
  private notifyChange: (html: string) => void = () => undefined;
  private notifyTouched: () => void = () => undefined;

  protected readonly state = signal(EMPTY_RICH_TEXT_STATE);
  protected readonly isDisabled = signal(false);
  protected readonly areaClasses = computed(() => AREA_CLASSES[this.appearance()]);

  writeValue(html: string | null): void {
    const safeHtml = this.sanitizer.sanitize(SecurityContext.HTML, html ?? '') ?? '';
    const element = this.area().nativeElement;
    if (element.innerHTML !== safeHtml) {
      element.innerHTML = safeHtml;
    }
  }

  registerOnChange(notify: (html: string) => void): void {
    this.notifyChange = notify;
  }

  registerOnTouched(notify: () => void): void {
    this.notifyTouched = notify;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  protected saveTyping(): void {
    this.notifyChange(toStoredEditorHtml(this.area().nativeElement.innerHTML));
    this.refreshState();
  }

  protected useParagraphLines(): void {
    this.runner.run('defaultParagraphSeparator', 'p');
  }

  protected markTouched(): void {
    this.notifyTouched();
  }

  protected refreshState(): void {
    this.state.set(readRichTextState(this.runner));
  }

  protected runCommand(command: RichTextCommand): void {
    this.area().nativeElement.focus();
    if (command === 'link') {
      this.addLink();
    } else {
      const step = editingStepFor(command);
      this.runner.run(step.name, step.value);
    }
    this.saveTyping();
  }

  protected pastePlainText(event: ClipboardEvent): void {
    event.preventDefault();
    this.runner.run('insertText', event.clipboardData?.getData('text/plain') ?? '');
    this.saveTyping();
  }

  private addLink(): void {
    const url = normalizeLinkUrl(window.prompt(LINK_PROMPT));
    if (url) {
      this.runner.run('createLink', url);
    }
  }
}
