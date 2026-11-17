import { TestBed } from '@angular/core/testing';
import { EXCEL_TYPE } from './excel-file';
import { ExportFileSaver } from './export-file-saver';
import { FileSaver } from './file-saver';

describe('ExportFileSaver', () => {
  const saved: { file: Blob; name: string }[] = [];

  beforeEach(() => {
    saved.length = 0;
    TestBed.configureTestingModule({
      providers: [
        {
          provide: FileSaver,
          useValue: { save: (file: Blob, name: string) => saved.push({ file, name }) },
        },
      ],
    });
  });

  afterEach(() => vi.restoreAllMocks());

  it('saves the export as an .xlsx file', async () => {
    await TestBed.inject(ExportFileSaver).save(new Blob(['a,b\n1,2']), 'places-2026-11-17');

    expect(saved.map(({ name }) => name)).toEqual(['places-2026-11-17.xlsx']);
    expect(saved[0].file.type).toBe(EXCEL_TYPE);
  });

  it('falls back to the server file when it cannot be turned into Excel', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const csv = new Blob(['a,b']);
    vi.spyOn(csv, 'arrayBuffer').mockRejectedValue(new Error('unreadable'));

    await TestBed.inject(ExportFileSaver).save(csv, 'places-2026-11-17');

    expect(saved).toEqual([{ file: csv, name: 'places-2026-11-17.csv' }]);
  });
});
