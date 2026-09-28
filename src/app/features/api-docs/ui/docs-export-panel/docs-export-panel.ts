import { ChangeDetectionStrategy, Component, output } from '@angular/core';

@Component({
  selector: 'app-docs-export-panel',
  templateUrl: './docs-export-panel.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocsExportPanel {
  readonly downloadReadme = output<void>();
  readonly printPdf = output<void>();
}
