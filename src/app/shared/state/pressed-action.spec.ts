import { signal } from '@angular/core';
import { PressedAction } from './pressed-action';

describe('PressedAction', () => {
  it('names the pressed action while its request runs', () => {
    const isBusy = signal(false);
    const pressedAction = new PressedAction<'pause' | 'remove'>(isBusy);

    pressedAction.press('pause');
    isBusy.set(true);

    expect(pressedAction.spinning()).toBe('pause');
  });

  it('names nothing once the request ends', () => {
    const isBusy = signal(true);
    const pressedAction = new PressedAction<'pause' | 'remove'>(isBusy);
    pressedAction.press('remove');

    isBusy.set(false);

    expect(pressedAction.spinning()).toBeNull();
  });

  it('names nothing while busy if no button was pressed here', () => {
    const pressedAction = new PressedAction<'pause'>(signal(true));

    expect(pressedAction.spinning()).toBeNull();
  });
});
