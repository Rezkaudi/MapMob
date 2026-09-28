import { TestBed } from '@angular/core/testing';
import { FileSaver } from '../../../shared/files/file-saver';
import { API_REFERENCE } from '../data/api-reference';
import { ApiReference } from '../models/api-reference';
import { ApiReferenceExporter, README_FILE_NAME } from './api-reference-exporter';
import { BrowserPrinter } from './browser-printer';

const reference: ApiReference = {
  title: 'MapMob Admin API',
  updatedOn: '2026-09-28',
  conventions: [],
  features: [],
  domains: [],
  buildOrder: { head: ['Step'], rows: [] },
  wholeErdLayout: [],
  openQuestions: [],
};

describe('ApiReferenceExporter', () => {
  const saver = { save: vi.fn() };
  const printer = { print: vi.fn() };

  beforeEach(() => {
    saver.save.mockReset();
    printer.print.mockReset();
    TestBed.configureTestingModule({
      providers: [
        { provide: API_REFERENCE, useValue: reference },
        { provide: FileSaver, useValue: saver },
        { provide: BrowserPrinter, useValue: printer },
      ],
    });
  });

  it('downloads the reference as a Markdown README', async () => {
    TestBed.inject(ApiReferenceExporter).downloadReadme();

    const [file, fileName] = saver.save.mock.calls[0] as [Blob, string];
    expect(fileName).toBe(README_FILE_NAME);
    expect(file.type).toBe('text/markdown;charset=utf-8');
    expect(await file.text()).toContain('# MapMob Admin API');
  });

  it('opens the print dialog for a PDF', () => {
    TestBed.inject(ApiReferenceExporter).printPdf();

    expect(printer.print).toHaveBeenCalledTimes(1);
  });
});
