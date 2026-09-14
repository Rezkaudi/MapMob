import { ConfirmDialogFlow } from './confirm-dialog-flow';
import { ConfirmWriteActions } from './confirm-write-actions';
import { CrudEntry } from './crud-entry';

const AHMAD: CrudEntry = { id: 'user-1', name: 'أحمد جمال', status: 'suspended' };

function createFlow(isSaved = true) {
  const actions: ConfirmWriteActions = {
    changeStatus: vi.fn(async () => isSaved),
    remove: vi.fn(async () => isSaved),
  };
  return { flow: new ConfirmDialogFlow<CrudEntry>(actions), actions };
}

describe('ConfirmDialogFlow', () => {
  it('starts closed', () => {
    expect(createFlow().flow.request()).toBeNull();
  });

  it('asks to activate a suspended entry, then activates it and closes', async () => {
    const { flow, actions } = createFlow();
    flow.openStatusChange(AHMAD);
    expect(flow.request()).toEqual({ type: 'confirm', action: 'activate', entry: AHMAD });

    await flow.confirm();

    expect(actions.changeStatus).toHaveBeenCalledWith('user-1', 'active');
    expect(flow.request()).toBeNull();
  });

  it('asks to delete an entry, then deletes it', async () => {
    const { flow, actions } = createFlow();
    flow.openDelete(AHMAD);

    await flow.confirm();

    expect(actions.remove).toHaveBeenCalledWith('user-1');
  });

  it('stays open when the save fails', async () => {
    const { flow } = createFlow(false);
    flow.openDelete(AHMAD);

    await flow.confirm();

    expect(flow.request()).not.toBeNull();
  });

  it('does nothing when confirming with no dialog open', async () => {
    const { flow, actions } = createFlow();

    await flow.confirm();

    expect(actions.remove).not.toHaveBeenCalled();
    expect(actions.changeStatus).not.toHaveBeenCalled();
  });
});
