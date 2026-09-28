import { TestBed } from '@angular/core/testing';
import { DocsExportPanel } from './docs-export-panel';

describe('DocsExportPanel', () => {
  it('asks for the README and for the PDF', () => {
    const fixture = TestBed.createComponent(DocsExportPanel);
    fixture.detectChanges();
    const readme = vi.fn();
    const pdf = vi.fn();
    fixture.componentInstance.downloadReadme.subscribe(readme);
    fixture.componentInstance.printPdf.subscribe(pdf);

    fixture.nativeElement.querySelector('[data-export="readme"]').click();
    fixture.nativeElement.querySelector('[data-export="pdf"]').click();

    expect(readme).toHaveBeenCalled();
    expect(pdf).toHaveBeenCalled();
  });
});
