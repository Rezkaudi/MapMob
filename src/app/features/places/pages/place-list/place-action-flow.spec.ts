import { createPlace } from '../../testing/place-fixture';
import { PlaceActionFlow, PlaceWriteActions } from './place-action-flow';

function createFlow(overrides: Partial<PlaceWriteActions> = {}) {
  const calls: string[] = [];
  const flow = new PlaceActionFlow({
    changeStatus: (ids, status) => {
      calls.push(`status:${ids.join(',')}:${status}`);
      return Promise.resolve(true);
    },
    deletePlaces: (ids) => {
      calls.push(`delete:${ids.join(',')}`);
      return Promise.resolve(true);
    },
    exportPlaces: (ids) => {
      calls.push(`export:${ids.join(',')}`);
      return Promise.resolve(true);
    },
    ...overrides,
  });
  return { flow, calls };
}

describe('PlaceActionFlow', () => {
  it('suspends an active row and activates any other', () => {
    const { flow } = createFlow();

    flow.askForStatusChange(createPlace());
    expect(flow.dialog()?.confirmLabel).toBe('إيقاف الشركات');

    flow.askForStatusChange(createPlace({ status: 'pending' }));
    expect(flow.dialog()?.confirmLabel).toBe('تفعيل الشركات');
  });

  it('names the row that asked, and counts the ticked rows otherwise', () => {
    const { flow } = createFlow();

    flow.askForRow(createPlace(), 'delete');
    expect(flow.note()).toBe('صيدلية الحياة');

    flow.askForSelection('delete', ['place-1', 'place-2']);
    expect(flow.note()).toBe('تم تحديد 2 شركات');
  });

  it('runs the action behind the dialog, then closes it', async () => {
    const { flow, calls } = createFlow();

    flow.askForSelection('suspend', ['place-1']);
    await flow.confirm();
    flow.askForSelection('export', ['place-2']);
    await flow.confirm();

    expect(calls).toEqual(['status:place-1:suspended', 'export:place-2']);
    expect(flow.dialog()).toBeNull();
  });

  it('keeps the dialog open when the write fails', async () => {
    const { flow } = createFlow({ deletePlaces: () => Promise.resolve(false) });

    flow.askForSelection('delete', ['place-1']);
    await flow.confirm();

    expect(flow.dialog()).not.toBeNull();
  });
});
