import { HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom, of, throwError } from 'rxjs';
import { ApiError } from './api-error';
import { replaceRefusalMessage } from './replace-refusal-message';

const ARABIC_MESSAGE = 'لا يمكن الحذف.';

describe('replaceRefusalMessage', () => {
  it('gives a refused request (422) the panel message instead of the server one', async () => {
    const refused = throwError(() => new ApiError(422, 'Cannot delete this.'));

    await expect(
      firstValueFrom(refused.pipe(replaceRefusalMessage(ARABIC_MESSAGE))),
    ).rejects.toThrow(ARABIC_MESSAGE);
  });

  it('reads the status of a raw HTTP error too', async () => {
    const refused = throwError(() => new HttpErrorResponse({ status: 422 }));

    await expect(
      firstValueFrom(refused.pipe(replaceRefusalMessage(ARABIC_MESSAGE))),
    ).rejects.toThrow(ARABIC_MESSAGE);
  });

  it('keeps any other error as it is', async () => {
    const failed = throwError(() => new ApiError(500, 'Server Error'));

    await expect(
      firstValueFrom(failed.pipe(replaceRefusalMessage(ARABIC_MESSAGE))),
    ).rejects.toMatchObject({ status: 500, message: 'Server Error' });
  });

  it('lets a successful answer through', async () => {
    expect(await firstValueFrom(of('done').pipe(replaceRefusalMessage(ARABIC_MESSAGE)))).toBe(
      'done',
    );
  });
});
