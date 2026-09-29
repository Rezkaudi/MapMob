import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { JsonToken, JsonTokenKind } from '../../models/json-token';
import { tokenizeJson } from '../../state/json-tokens';
import { ScriptRun, splitScriptRuns } from '../../state/script-runs';
import { ClipboardWriter } from '../../../../shared/browser/clipboard-writer';
import { CodeLanguage } from './code-language';

const COPIED_NOTICE_MS = 1600;

/** Light colours on the dark block, and dark ones on paper. */
const TOKEN_CLASSES: Record<JsonTokenKind, string> = {
  key: 'text-[#7DD3FC] print:text-[#0369A1]',
  string: 'text-[#86EFAC] print:text-[#15803D]',
  number: 'text-[#FCD34D] print:text-[#B45309]',
  literal: 'text-[#C4B5FD] print:text-[#6D28D9]',
  plain: 'text-[#CBD5E1] print:text-[#334155]',
};

@Component({
  selector: 'app-code-block',
  templateUrl: './code-block.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CodeBlock {
  private readonly clipboard = inject(ClipboardWriter);

  readonly code = input.required<string>();
  readonly language = input<CodeLanguage>('json');
  readonly label = input('');

  protected readonly isCopied = signal(false);
  protected readonly tokens = computed(() => {
    const tokens: readonly JsonToken[] =
      this.language() === 'json'
        ? tokenizeJson(this.code())
        : [{ kind: 'plain', text: this.code() }];
    return tokens.map((token) => ({
      kind: token.kind,
      runs: splitScriptRuns(token.text) as readonly ScriptRun[],
    }));
  });
  protected readonly tokenClasses = TOKEN_CLASSES;

  protected async copy(): Promise<void> {
    await this.clipboard.write(this.code());
    this.isCopied.set(true);
    setTimeout(() => this.isCopied.set(false), COPIED_NOTICE_MS);
  }
}
