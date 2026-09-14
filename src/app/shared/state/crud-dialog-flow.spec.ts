import { CrudDialogFlow } from './crud-dialog-flow';
import { CrudEntry } from './crud-entry';
import { CrudWriteActions } from './crud-write-actions';

const TARTUS: CrudEntry = { id: 'a', name: 'طرطوس', status: 'active' };
interface NameDraft {
  readonly name: string;
}

const DRAFT: NameDraft = { name: 'حماة' };

function createFlow(isSaved = true) {
  const actions: CrudWriteActions<NameDraft> = {
    create: vi.fn(async () => isSaved),
    update: vi.fn(async () => isSaved),
    changeStatus: vi.fn(async () => isSaved),
    remove: vi.fn(async () => isSaved),
  };
  return { flow: new CrudDialogFlow<CrudEntry, NameDraft>(actions), actions };
}

describe('CrudDialogFlow', () => {
  it('starts closed', () => {
    expect(createFlow().flow.request()).toBeNull();
  });

  it('creates from the add form and closes once saved', async () => {
    const { flow, actions } = createFlow();
    flow.openCreate();
    expect(flow.request()).toEqual({ type: 'form', mode: 'create', entry: null });

    await flow.submitDraft(DRAFT);

    expect(actions.create).toHaveBeenCalledWith(DRAFT);
    expect(flow.request()).toBeNull();
  });

  it('updates the entry from the edit form', async () => {
    const { flow, actions } = createFlow();
    flow.openEdit(TARTUS);

    await flow.submitDraft(DRAFT);

    expect(actions.update).toHaveBeenCalledWith('a', DRAFT);
  });

  it('asks to suspend an active entry, then suspends it', async () => {
    const { flow, actions } = createFlow();
    flow.openStatusChange(TARTUS);
    expect(flow.request()).toEqual({ type: 'confirm', action: 'suspend', entry: TARTUS });

    await flow.confirm();

    expect(actions.changeStatus).toHaveBeenCalledWith('a', 'suspended');
    expect(flow.request()).toBeNull();
  });

  it('asks to delete an entry, then deletes it', async () => {
    const { flow, actions } = createFlow();
    flow.openDelete(TARTUS);

    await flow.confirm();

    expect(actions.remove).toHaveBeenCalledWith('a');
  });

  it('stays open when the save fails, so the user can try again', async () => {
    const { flow } = createFlow(false);
    flow.openCreate();

    await flow.submitDraft(DRAFT);

    expect(flow.request()).not.toBeNull();
  });

  it('ignores a submit or confirm with no matching dialog open', async () => {
    const { flow, actions } = createFlow();

    await flow.submitDraft(DRAFT);
    await flow.confirm();
    flow.openCreate();
    await flow.confirm();

    expect(actions.create).not.toHaveBeenCalled();
    expect(actions.changeStatus).not.toHaveBeenCalled();
    expect(actions.remove).not.toHaveBeenCalled();
  });

  it('closes on request', () => {
    const { flow } = createFlow();
    flow.openDelete(TARTUS);

    flow.close();

    expect(flow.request()).toBeNull();
  });
});
